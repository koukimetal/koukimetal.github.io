
var parser = function(cycle) {
    return cycle.join(' ');
};

var initialize = function() {
    var problem = getUrlParameter()['id'];
    if (problem == null) {
        return;
    }
    $.ajax({
        url: 'sample/ans/' + problem + '.json',
        dataType: 'json',
        cache: true,
        success: function(data) {
            $('#answer').val(parser(data));
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });
};

initialize();