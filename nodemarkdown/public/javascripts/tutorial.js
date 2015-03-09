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
//    setInterval(this.loadMdData, 10000);
  },
  render: function() {
//    console.log(this.state.inputText);
    var rawMarkup = converter.makeHtml(this.state.inputText);
    return (
     <div onSubmit={this.loadMdData}>
       <Writer tBoxData={this.state.inputText}/>
       <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
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
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea rows="10" cols="80" name="formText" onChange="textchange()" value={this.props.tBoxData} placeholder="write something...">
        </textarea>
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
        console.log('item added');
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
  $('#content')[0]);
});
