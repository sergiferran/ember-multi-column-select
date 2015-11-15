import Ember from 'ember';

/*
  This function waits process until evalFn return true or timeout triggers
*/

export default function(evalFn, timeout) {
  timeout = timeout || 3000;
  return new Ember.RSVP.Promise((resolve, reject) => {
    let waiter;
    let timeoutFn = Ember.run.later(() => {
      if (waiter) {
        Ember.run.cancel(waiter);
      }
      reject('async helper timed out');
    }, timeout);

    let waiterFn = null;

    waiterFn = () => {
      waiter = null;
      if (evalFn.call(this)) {
        Ember.run.cancel(timeoutFn);
        Ember.run.next(this, () => {
          resolve();
        });
      } else {
        waiter = Ember.run.later(this, waiterFn, 50);
      }
    };
    waiterFn.call(this);
  });
}