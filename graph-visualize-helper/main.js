//TODO src, dst

var draw = function(){
    var data = parse();
    var container = document.getElementById('graph');
    var options = {};
    var network = new vis.Network(container, data, options);
};

var parse = function() {
    var text = $('#input').val();
    var nums = text.split(/\s+/);

    var N = nums[0];
    var M = nums[1];

    //nodes
    var nodes = [];
    var from1 = $('#from1').is(':checked');
    var shift = from1 ? 1 : 0;
    var src = $('#source').val();
    var dst = $('#destination').val();
    for (var i = 0; i < N; i++) {
        var node = {id:i + shift, label:i + shift};
        if (i == src) {
            node.color = {};
            node.color.background = "#FFCCFF";
        } else if (i == dst) {
            node.color = {};
            node.color.background = "#99CC66";
        }

        nodes.push(node);
    }

    //edges
    var edges = [];
    var directed = $('#directed').is(':checked');
    var edgeValue = $('#edgeValue').is(':checked');
    var chunk = edgeValue ? 3 : 2;

    for (i = 0; i < chunk*M; i += chunk) {
        var a = nums[i + 2];
        var b = nums[i + 3];
        var edge = {from:a, to:b};
        if (directed) {
            edge.arrows = 'to';
        }
        if (edgeValue) {
            var c = nums[i + 4];
            edge.width = c;
            edge.label = c;
            edge.font = {};
            edge.font.color = 'red';
        }
        edges.push(edge);
    }

    return {nodes: nodes, edges:edges};
};

$(function() {
    $('#visualize').click(draw);
});