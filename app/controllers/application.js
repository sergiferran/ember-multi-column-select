import Ember from 'ember';

export default Ember.Controller.extend({
	dataColumn1: function() {
		return [{
			text: 'Company',
			selected: true
		}, {
			text: 'Product',
			selected: false
		}, {
			text: 'Variant',
			selected: false
		}, {
			text: 'Location',
			selected: false
		}, {
			text: 'Assignee',
			selected: false
		}, {
			text: 'Shipping Address',
			selected: false
		}].map((item) => Ember.Object.create(item));
	}.property(),

	dataColumn2: function() {
		return [{
			text: 'Cogs Realized',
			selected: true
		}, {
			text: 'Cogs Potential',
			selected: false
		}, {
			text: 'Realized Profit',
			selected: false
		}].map((item) => Ember.Object.create(item));
	}.property(),

	firstData: function() {
		let dataColumn1 = this.get('dataColumn1');
		let dataColumn2 = this.get('dataColumn2');
		return [{
			title: 'Dimensions',
			data: dataColumn1,
		}, {
			title: 'Options',
			data: dataColumn2,
		}];
	}.property('dataColumn1', 'dataColumn1.length', 'dataColumn2', 'dataColumn2.length'),

	secondData: function() {
		let dataColumn2 = this.get('dataColumn2');
		return [{
			data: dataColumn2,
		}];
	}.property('dataColumn2', 'dataColumn2.length'),


	actions: {
		select1Action: function(data){
			this.set('dataColumn1', data.get('firstObject.data'));
			this.set('dataColumn2', data.get('lastObject.data'));
		},
		select2Action: function(data){
			this.set('dataColumn2', data.get('firstObject.data'));
		},
		toggleItem: function(item) {
			item.toggleProperty('selected');
		}
	}
});