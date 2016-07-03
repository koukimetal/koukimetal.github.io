"use strict";
//WISH show degree
var HamiltonCycle = function (N, E) {
    this.nodes = this.makeNodes(N);
    this.edges = this.makeEdges(E);
    this.container = document.getElementById('problem');
    this.data = {
        nodes: this.nodes,
        edges: this.edges
    };
    this.degree = new Array(N);
    for (var i = 0; i < N; i++) {
        this.degree[i] = 0;
    }
    this.options = {
        physics: {
            enabled: true
        }
    };

    this.SELECTED_NODE = '#ffff99';
    this.PASSED_NODE = '#ccff99';
    this.OVER_NODE = '#ffcccc';
    this.SELECTED_EDGE = '#ff3232';

    this.edgeSet = new Set();
    this.selected = -1;

    this.network = new vis.Network(this.container, this.data, this.options);
    this.network.on("doubleClick", function (params) {
        if (params.nodes.length == 0) {
            if (this.selected !== -1) {
                this.nodeColorChange(this.selected, false);
                this.selected = -1;
            }
            return;
        }
        var id = params.nodes[0];
        this.handleDoubleClicked(id, params.edges);
    }.bind(this));
};

HamiltonCycle.prototype.makeNodes = function(N) {
    var nodes = new Array(N);
    for (var i = 0; i < N; i++) {
        nodes[i] = {id: i, label: i};
    }
    return new vis.DataSet(nodes);
};

HamiltonCycle.prototype.makeEdges = function(E) {
    var edges = new Array(E.length/2);
    for (var i = 0; i < E.length; i += 2) {
        edges[i/2] = {id: i/2, from: E[i], to: E[i+1]};
    }
    return new vis.DataSet(edges);
};

HamiltonCycle.prototype.handleDoubleClicked = function(id, neighborIds) {
    var edgeId = this.getEdge(neighborIds, this.selected, id);
    if (edgeId >= 0) {
        if (this.edgeSet.has(edgeId)) {
            this.degree[this.selected]--;
            this.degree[id]--;
        } else {
            this.degree[this.selected]++;
            this.degree[id]++;
        }
    }
    this.move(id, edgeId);
    if (edgeId >= 0) {
        var result = this.check();
        if (result.ok) {
            this.success(result);
        }
    }
};

HamiltonCycle.prototype.success = function(result) {
    alert('Congratulation!');
    $('#MyHamilton').val(result.route.join(' '));
};

HamiltonCycle.prototype.recCheck = function(id, visited, graph, route, depth) {
    visited[id] = true;
    route[depth] = id;
    for (var i = 0; i < graph[id].length; i++) {
        var next = graph[id][i];
        if (visited[next] !== true) {
            this.recCheck(next, visited, graph, route, depth + 1);
        }
    }
};

HamiltonCycle.prototype.check = function(){
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.degree[i] != 2) {
            return false;
        }
    }

    var graph = new Array(this.nodes.length);
    for (i = 0; i < this.nodes.length; i++) {
        graph[i] = [];
    }

    this.edgeSet.forEach(function(edgeId) {
        var edge = this.edges.get(edgeId);
        graph[edge.from].push(edge.to);
        graph[edge.to].push(edge.from);
    }.bind(this));

    var route = new Array(this.nodes.length + 1);
    var visited = new Array(this.nodes.length);
    this.recCheck(0, visited, graph, route, 0);

    for (i = 0; i < this.nodes.length; i++) {
        if (visited[i] !== true) {
            return {
                ok: false
            };
        }
    }

    route[this.nodes.length] = 0;
    return {
        ok: true,
        route: route
    };
};

HamiltonCycle.prototype.move = function(id, edgeId) {
    if (this.selected === id) {
        this.nodeColorChange(id, false);
        this.selected = -1;
        return;
    } else if (this.selected === -1) {
        this.nodeColorChange(id, true);
        this.selected = id;
        return;
    }

    this.nodeColorChange(this.selected, false);
    this.nodeColorChange(id, true);
    this.selected = id;

    if (edgeId === -1) {
        return;
    }

    if (this.edgeSet.has(edgeId)) {
        this.edgeSet.delete(edgeId);
        this.edges.update([
            {
                id: edgeId,
                color: null
            }
        ]);
    } else {
        this.edgeSet.add(edgeId);
        this.edges.update([
            {
                id: edgeId,
                color: {
                    color: this.SELECTED_EDGE,
                    highlight: this.SELECTED_EDGE
                }
            }
        ]);
    }
};

HamiltonCycle.prototype.nodeColorChange = function(id, select) {
    if (select) {
        this.nodes.update(
            [
                {
                    id: id,
                    color: {
                        background: this.SELECTED_NODE,
                        highlight: {
                            background: this.SELECTED_NODE
                        }
                    }
                }
            ]
        );
    } else {
        var color = null;
        if (this.degree[id] > 0) {
            var colorVal = this.PASSED_NODE;
            if (this.degree[id] > 2) {
                colorVal = this.OVER_NODE;
            }
            color = {
                background: colorVal,
                highlight: {
                    background: colorVal
                }
            };
        }
        this.nodes.update(
            [
                {
                    id: id,
                    color: color
                }
            ]
        );
    }
};

HamiltonCycle.prototype.getEdge = function(neighborIds, fId, tId) {
    for (var i = 0; i < neighborIds.length; i++) {
        var edgeId = neighborIds[i];
        var edge = this.edges.get(edgeId);

        if (edge.from == fId && edge.to == tId || edge.from == tId && edge.to == fId) {
            return edge.id;
        }
    }
    return -1;
};

HamiltonCycle.prototype.export = function() {
    var res = new Array(this.edges.length + 1);
    res[0] = this.nodes.length + ' ' + this.edges.length;
    for (var i = 0; i < this.edges.length; i++) {
        var edge = this.edges.get(i);
        res[i + 1] = edge.from + ' ' + edge.to;
    }
    return res.join('\n');
};

HamiltonCycle.prototype.setPhysics = function(physics) {
    this.network.setOptions({physics: {
        enabled: physics
    }});
};

HamiltonCycle.prototype.setSmooth = function(smooth) {
    this.network.setOptions({edges: {
        smooth: {
            enabled: smooth
        }
    }});
};
