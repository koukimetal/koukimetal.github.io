"use strict";

var parser = function(obj) {
    var res = new Array(obj.M + 1);
    res[0] = obj.N + ' ' + obj.M;
    for (var i = 0; i < obj.M; i++) {
        var a = obj.E[2*i];
        var b = obj.E[2*i + 1];
        res[i + 1] = a + ' ' + b;
    }
    return res.join('\n');
};

var GRAPH;

var initialize = function() {
    var problem = getUrlParameter()['id'];
    if (problem == null) {
        return;
    }
    $.ajax({
        url: 'sample/' + problem + '.json',
        dataType: 'json',
        cache: true,
        success: function(data) {
            $('#rawData').val(parser(data));
            GRAPH = new Array(data.N);
            for (var i = 0; i < data.N; i++) {
                GRAPH[i] = new Set();
            }
            for (i = 0; i < data.M; i++) {
                var a = + data.E[2*i];
                var b = + data.E[2*i + 1];
                GRAPH[a].add(b);
                GRAPH[b].add(a);
            }
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });
};

var check = function(cycle) {
    if (cycle.length < 4) {
        alert('Give me cycle');
        return false;
    }
    if (cycle[0] !== cycle[GRAPH.length]) {
        alert('Start and end should be same');
        return false;
    }
    var vd = new Array(GRAPH.length);
    vd = vd.map(function() {return 0});
    var v = cycle[0];
    for (var i = 1; i < cycle.length; i++) {
        var nx = cycle[i];
        if (!GRAPH[v].has(nx)) {
            alert('No edge from ' + v + ' to ' + nx);
            return false;
        }
        vd[nx]++;
        if (vd[nx] >= 2) {
            alert("Don't visit same vertex twice");
            return false;
        }
        v = nx;
    }
    return true;
};

initialize();

$('#submitAnswer').click(function() {
    var text = $('#MyHamilton').val();
    var input = text.split(/\s+/);
    var cycle = new Array(GRAPH.length + 1);
    var j = 0;
    for (var i = 0; i < input.length && j <= GRAPH.length; i++) {
        var v = input[i];
        if (v !== "") {
            cycle[j] = + v;
            j++;
        }
    }
    if (j !== GRAPH.length + 1) {
        alert('The length of cycle should be N + 1');
        return;
    }
    if (check(cycle)) {
        alert('success!');
    }
});