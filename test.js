(function (){
  module('performance');

  function sleep(delay){
    var start = performance.now();
    while( true ){
      if( performance.now() - start >= delay ){
        break;
      }
    }
  }


  test('now', function (){
    var start = performance.now();
    sleep(1);
    ok(performance.now() - start < 1.5);
  });


  test('performance.mark', function (){
    performance.mark("foo");
    sleep(5);
    performance.mark("bar");
    sleep(10);
    performance.mark("baz");

    equal(performance.getEntriesByType('mark').length, 3);
    ok(performance.getEntriesByName('baz')[0].startTime - performance.getEntriesByName('bar')[0].startTime < 11, 'baz - bar');
    ok(performance.getEntriesByName('bar')[0].startTime - performance.getEntriesByName('foo')[0].startTime < 6, 'bar - foo');

    performance.clearMarks('bar');

    equal(performance.getEntriesByType('mark').length, 2);
    equal(performance.getEntriesByName('foo').length, 1);
    equal(performance.getEntriesByName('bar').length, 0);
    equal(performance.getEntriesByName('baz').length, 1);

    performance.clearMarks();
    equal(performance.getEntriesByType('mark').length, 0);
  });


  test('performance.measure', function (){
    performance.mark("foo");
    sleep(5);
    performance.mark("bar");

    performance.measure('foo_bar', 'foo', 'bar');

    equal(performance.getEntriesByType('measure').length, 1);
    ok(performance.getEntriesByName('foo_bar')[0].duration < 6, performance.getEntriesByName('foo_bar')[0].duration+'');

    performance.mark("foo");
    sleep(5);
    performance.mark("bar");
    sleep(5);
    performance.mark("foo");

    performance.measure('foo_bar', 'foo', 'bar');
    equal(performance.getEntriesByType('measure').length, 2);
    ok(performance.getEntriesByName('foo_bar')[1].duration < -5, performance.getEntriesByName('foo_bar')[1].duration+'');

    performance.clearMarks();
    performance.clearMeasures();
    equal(performance.getEntriesByType('measure').length, 0);
  });
})();
