import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import asyncHelper from '../../helpers/asyncHelper';

moduleForComponent('multi-column-select', 'Integration | Component | multi column select', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{multi-column-select}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select}}
      template block text
    {{/multi-column-select}}
  `);
  assert.equal(this.$().text().trim(), 'template block text');
});

test('if click on trigger should show No-content when data is not set', function(assert) {
  assert.expect(2);

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select}}
      Open
    {{/multi-column-select}}
  `);
  this.$('.mcs-trigger').click();
  assert.equal(this.$('.mcs-container').length, 1, 'container exists');
  assert.equal(this.$('.mcs-container .mcs-no-content').length, 1, 'no content exists');
});

test('if click on trigger should show select when data is set', function(assert) {
  assert.expect(6);

  this.set('myData', [{
      title: 'column 1',
      data: [{
        text: 'Text A',
        selected: true
      },{
        text: 'Text B'
      }],
    },{
      title: 'column 2',
      data: [{
        text: 'Text C',
        selected: true
      },{
        text: 'Text D'
      },{
        text: 'Text E'
      }],
    }]);

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select data=myData}}
      Open
    {{/multi-column-select}}
  `);
  this.$('.mcs-trigger').click();
  assert.equal(this.$('.mcs-container').length, 1, 'container exists');
  assert.equal(this.$('.mcs-container .mcs-column').length, 2, '2 columns exists');
  assert.equal(this.$('.mcs-container .mcs-column-title:eq(0)').text().trim(), "column 1", 'column 1 title ok');
  assert.equal(this.$('.mcs-container .mcs-column-title:eq(1)').text().trim(), "column 2", 'column 2 title ok');
  assert.equal(this.$('.mcs-container .mcs-column:eq(0) .mcs-item').length, 2, 'There are 2 items in column 1');
  assert.equal(this.$('.mcs-container .mcs-column:eq(1) .mcs-item').length, 3, 'There are 3 items in column 2');
});

test('if click on an item it should change check status', function(assert) {
  assert.expect(10);

  this.set('myData', [{
      title: 'column 1',
      data: [{
        text: 'Text A',
        selected: true
      },{
        text: 'Text B'
      }],
    }]);

  this.on('myAction', (myData)=>{
    assert.equal(myData.get('firstObject.data.firstObject.selected'), false, 'selected field is false');
    assert.equal(myData.get('firstObject.data.1.selected'), true, 'selected field is true');
  });

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select data=myData action="myAction"}}
      Open
    {{/multi-column-select}}
  `);
  this.$('.mcs-trigger').click();
  assert.ok(this.$('.mcs-container .mcs-item:eq(0)').is('.selected'), 'Before click is selected');
  assert.ok(this.$('.mcs-container .mcs-item:eq(1)').is(':not(.selected)'), 'Before click is selected');
  this.$('.mcs-container .mcs-item:eq(0)').click();
  assert.ok(this.$('.mcs-container .mcs-item:eq(0)').is('.hover'), 'After click is hovered');
  assert.ok(this.$('.mcs-container .mcs-item:eq(0)').is(':not(.selected)'), 'After click is not selected');
  this.$('.mcs-container .mcs-item:eq(1)').click();
  assert.ok(this.$('.mcs-container .mcs-item:eq(0)').is(':not(.hover)'), 'After click in other item, hover is removed');
  assert.ok(this.$('.mcs-container .mcs-item:eq(1)').is('.hover'), 'After click is hovered');
  assert.ok(this.$('.mcs-container .mcs-item:eq(1)').is('.selected'), 'After click is not selected');
  this.$('.mcs-trigger').click();
  assert.equal(this.$('.mcs-container').length, 0, 'container is hided');
});

test('if title is not passed, shouldn\'t exist', function(assert) {
  assert.expect(2);

  this.set('myData', [{
      data: [{
        text: 'Text A',
        selected: true
      },{
        text: 'Text B'
      }],
    }]);

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select data=myData}}
      Open
    {{/multi-column-select}}
  `);
  this.$('.mcs-trigger').click();
  assert.equal(this.$('.mcs-container').length, 1, 'container is shown');
  assert.equal(this.$('.mcs-container .msc-column').length, 0, 'column doesn\'t exists' );
});

test('select should be left aligned with trigger when is at left', function(assert) {
  assert.expect(1);

  this.set('myData', [{
      data: [{
        text: 'Text A',
        selected: true
      },{
        text: 'Text B'
      }],
    }]);

  // Template block usage:
  this.render(hbs`
    {{#multi-column-select data=myData}}
      Open
    {{/multi-column-select}}
  `);
  this.$('.mcs-trigger').click();
  assert.equal(this.$('.mcs-container').offset().left, this.$('.mcs-trigger').offset().left, 'left is the same');
});

test('select should be right aligned with trigger when is at right', function(assert) {
  assert.expect(1);

  this.set('myData', [{
      data: [{
        text: 'Text Long to do wider the container',
        selected: true
      },{
        text: 'Text B'
      }],
    }]);

  // Template block usage:
  this.render(hbs`
    <div style="text-align:right">
      {{#multi-column-select data=myData}}
        Open
      {{/multi-column-select}}
    </div>
  `);

  //To be sure page width is 500
  this.$().parent().offset({left: 0});
  this.$().parent().width(500);

  this.$('.mcs-trigger').click();

  var $trigger = this.$('.mcs-trigger');
  return asyncHelper(()=>{
    return this.$('.mcs-container').offset().left!== $trigger.offset().left;
  }).then(()=>{
    assert.equal(this.$('.mcs-container').offset().left, 500 - this.$('.mcs-container').width(), 'left is the same');
  });

});