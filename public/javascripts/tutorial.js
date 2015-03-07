"use strict";
/*global React*/
//var Showdown = require('showdown');

var converter = new Showdown.converter();

var DisplayMd = React.createClass({
  loadMdData: function() {
    $.getJSON('/save/mdstring', function(data) {
      console.log(data.mdstring);
      this.setState({inputText: data.mdstring});
    }.bind(this) );
  },
  getInitialState: function() {
    return {inputText: ''};
  },
  componentDidMount: function() {
    this.loadMdData();
  },
  render: function() {
    var rawMarkup = converter.makeHtml(this.state.inputText);
    return (
     <div className="row" onSubmit={this.loadMdData}>
       <div className="col s6">
         <div>
           <Writer tBoxData={this.state.inputText} />
         </div>
       </div>
       <div className="col s6">
         <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
       </div>
     </div>
    );
   }
});

var Writer = React.createClass({
  propTypes: {
    tBoxData: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  render: function() {
    var textareaStyle = {
      height: '350px',
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea style={textareaStyle} name="formText" onChange="textchange()" value={this.props.tBoxData} placeholder="write something..." />
        <br/>
        <input className="btn btn-primary" type="submit" value="save"/>
      </form>
    );
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var addItem = $(event.target).find("textarea[name=formText]").val();
    $.ajax({
      url: '/save/mdstore',
      dataType: 'json',
      type: 'POST',
      data: {mdstring: addItem, appName: 'nodemarkdown'},
      success: function(data) {
        $('#successmodal').modal();
      }.bind(this),
      error: function(xhr,status,err) {
        console.error(this.props.url,status,err.toString());
      }.bind(this)
  });
  }
});

$(document).ready(function() {
  React.render(
  <DisplayMd/>,
  $('#mdApp')[0]);
});
