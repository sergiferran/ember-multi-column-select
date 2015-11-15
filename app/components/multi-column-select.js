import Ember from 'ember';

let itemObject = Ember.Object.extend({
	text: null,
	selected: false,
	hover: false,
});

export default Ember.Component.extend({
	classNames: ['multi-column-select'],
	data: null,
	action: 'multiColumnSelect',

	isSelectVisible: null,

	_data: function() {
		return (this.get('data') || []).map((column) => {
			return {
				title: column.title,
				data: column.data.map((item) => itemObject.create(item))
			};
		});
	}.property('data'),

	clickOutsideFn: function() {
		return function(ev) {
			var $target = Ember.$(ev.target);
			var $parent = $target.parents('.multi-column-select');
			if (!$parent[0] || !$parent.is(this.$())) {
				this.send('close');
			}
		}.bind(this);
	}.property(),

	checkPositionFn: function() {
		return function() {
			if (this.get('isSelectVisible')) {
				var $app = Ember.$('.ember-application');
				var appLeft = $app.offset().left;
				var $trigger = this.$('.mcs-trigger');
				var triggerWidth = $trigger.width();
				var $container = this.$('.mcs-container');
				var left = $trigger.offset().left - appLeft;
				var width = $container.width();
				var availableWidth = $app.width();
				var newLeft;
				if (left + width < availableWidth) {
					newLeft = left;
				} else if (left + triggerWidth - width > 0) {
					newLeft = left + triggerWidth - width;
				} else {
					newLeft = (availableWidth - width) / 2;
				}
				$container.offset({
					left: newLeft + appLeft
				});
			}
		}.bind(this);
	}.property(),

	onInit: function() {
		Ember.$(window).on('resize', this.get('checkPositionFn'));
	}.on('didInsertElement'),

	willDestroy: function() {
		Ember.$(window).off('resize', this.get('checkPositionFn'));
		Ember.$(document).off('click', this.get('clickOutsideFn'));
		return this._super(...arguments);
	},

	afterRenderSelectObserver: function() {
		Ember.run.later(this, () => {
			if (this.get('isSelectVisible')) {
				Ember.$(document).on('click', this.get('clickOutsideFn'));
				this.get('checkPositionFn').call();
			} else {
				Ember.$(document).off('click', this.get('clickOutsideFn'));
			}
		}, 100);
	}.observes('isSelectVisible'),

	resetHover: function(column) {
		this.get(`_data.${column}.data`).setEach('hover', false);
	},

	closeSelect: function() {
		var data= this.get('_data');
		if(!Ember.isEmpty(data)){
			this.sendAction('action', data);
		}
	},

	actions: {
		toggle: function() {
			this.toggleProperty('isSelectVisible');
			if (!this.get('isSelectVisible')) {
				this.closeSelect();
			}
		},
		close: function() {
			this.set('isSelectVisible', false);
			this.closeSelect();
			this.get('_data').forEach((item, column) => {
				this.resetHover(column);
			});
		},
		toggleItem: function(item, column) {
			this.resetHover(column);
			item.toggleProperty('selected');
			item.set('hover', true);
		}
	}
});