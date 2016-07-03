var HeadRow = React.createClass({
    render: function() {
        return (
            <tr>
                <th>id</th>
                <th>name</th>
                <th>N</th>
                <th>M</th>
                <th>game</th>
                <th>console</th>
                <th>answer</th>
            </tr>
        );
    }
});

var NormalRow = React.createClass({

    answerTag: function() {
        if (this.props.answer === true) {
            var answerLink = '../HamiltonCycle/answer.html' + '?id=p' + this.props.id;
            return (
                <a href={answerLink}>answer</a>
            )
        } else {
            return '';
        }
    },

    render: function() {
        var gameLink = '../HamiltonCycle/game.html' + '?id=p' + this.props.id;
        var consoleLink = '../HamiltonCycle/console.html' + '?id=p' + this.props.id;
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
                <td>{this.props.N}</td>
                <td>{this.props.M}</td>
                <td><a href={gameLink}>game</a></td>
                <td><a href={consoleLink}>console</a></td>
                <td>{this.answerTag()}</td>
            </tr>
        );
    }
});

var MoveButton = React.createClass({
    render: function() {
        return (
            <button type="button" className="btn btn-default btn-md" onClick={function() {
                this.props.pressCall(this.props.vec);
            }.bind(this)}>
                <span className={this.props.icon} aria-hidden="true"></span> {this.props.text}
            </button>
        );
    }
});

var MainTable = React.createClass({
    getInitialState: function() {
        return {data: [], pos: 1};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    pressCall: function(vector) {
        vector = parseInt(vector);
        if (this.state.pos + vector <= 0) {
            return;
        }
        this.state.pos += vector;
        var url = "sample/p" + this.state.pos + ".json";
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                this.state.pos -= vector;
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        var data = this.state.data;
        return (
            <div>
                <a href="new.html">Submit your graph</a>
                <table className="table">
                    <thead>
                    <HeadRow />
                    </thead>
                    <tbody>
                    {data.map(
                        function(row) {
                            return <NormalRow id={row.id} name={row.name} N={row.N} M={row.M} answer={row.answer} />
                        }
                    )}
                    </tbody>
                </table>
                <MoveButton icon="glyphicon glyphicon-menu-left" text="Prev" pressCall={this.pressCall} vec="-1"/>
                <MoveButton icon="glyphicon glyphicon-menu-right" text="Next" pressCall={this.pressCall} vec="1"/>
            </div>
        );
    }
});
