var hamiltonCycle;

var handlePhysics = function() {
    var physics = $('#physics').is(':checked');
    hamiltonCycle.setPhysics(physics);
};

var handleSmooth = function() {
    var smooth = $('#smooth').is(':checked');
    hamiltonCycle.setSmooth(smooth);
};

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
            hamiltonCycle = new HamiltonCycle(data.N, data.E);
            handlePhysics();
            handleSmooth();
            $('#rawData').val(hamiltonCycle.export());
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });

};

initialize();

$('#physics').click(function() {
    handlePhysics();
});

$('#smooth').click(function() {
    handleSmooth();
});