"use strict";
/*global React*/
//var Showdown = require('showdown');

var converter = new Showdown.converter();

//var stateData = {
//  inputText: ''
//};

//var Renderer = React.createClass({
//  render: function() {
//     return (
//     <div>
//       <h1>Phrases</h1>
//         <Writer updateDisplayedMD={this.updateEntries}/>
//         <DisplayMd/>
//     </div>
//      );
//   },
//   updateEntries: function(additem) {
//     stateData.inputText = entry;
//     this.setState(stateData);
//   }
//});

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
//  propTypes: {
//    inputText: React.PropTypes.string.isRequired
  //},
  },
  render: function() {
    console.log(this.state.inputText);
    var rawMarkup = converter.makeHtml(this.state.inputText);
    return (
     <div>
       <Writer handleSubmit={this.componentDidMount} />
       <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
     </div>
    );
   }
});

var Writer = React.createClass({
  propTypes: {
    updateDisplayedMD: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea rows="10" cols="80" name="formText" placeholder="write something w/ md..."/>
        <br/>
        <input type="submit" />
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
        console.log('additem');
        console.log(addItem);
     //   this.props.updateDisplayedMD(addItem);
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
