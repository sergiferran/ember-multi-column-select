import Ember from 'ember';

const itemObject = Ember.Object.extend({
	text: null,
	selected: false,
	hover: false,
});

export default Ember.Component.extend({
	classNames: ['multi-column-select'],
	data: null,
	action: 'multiColumnSelect',

	isSelectVisible: null,

	_data: Ember.computed('data', function() {
		return (this.get('data') || []).map((column) => {
			return {
				title: column.title,
				data: column.data.map((item) => itemObject.create(item))
			};
		});
	}),

	clickOutsideFn: Ember.computed(function() {
		return function(ev) {
			let $target = Ember.$(ev.target);
			let $parent = $target.parents('.multi-column-select');
			if (!$parent[0] || !$parent.is(this.$())) {
				this.send('close');
			}
		}.bind(this);
	}),

	checkPositionFn: Ember.computed(function() {
		return function() {
			if (this.get('isSelectVisible')) {
				let $app = Ember.$('.ember-application');
				let appLeft = $app.offset().left;
				let $trigger = this.$('.mcs-trigger');
				let triggerWidth = $trigger.width();
				let $container = this.$('.mcs-container');
				let left = $trigger.offset().left - appLeft;
				let width = $container.width();
				let availableWidth = $app.width();
				let newLeft;
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
	}),

	onInit: Ember.on('didInsertElement', function() {
		Ember.$(window).on('resize', this.get('checkPositionFn'));
	}),

	willDestroy() {
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

	resetHover(column) {
		this.get(`_data.${column}.data`).setEach('hover', false);
	},

	closeSelect() {
		let data = this.get('_data');
		if (!Ember.isEmpty(data)) {
			this.sendAction('action', data);
		}
	},

	actions: {
		toggle() {
				this.toggleProperty('isSelectVisible');
				if (!this.get('isSelectVisible')) {
					this.closeSelect();
				}
			},
			close() {
				this.set('isSelectVisible', false);
				this.closeSelect();
				this.get('_data').forEach((item, column) => {
					this.resetHover(column);
				});
			},
			toggleItem(item, column) {
				this.resetHover(column);
				item.toggleProperty('selected');
				item.set('hover', true);
			}
	}
});