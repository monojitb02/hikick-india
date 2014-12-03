"jquery": "js/jquery-1.10.2.min.js",
"jquery-ui": "js/jquery-ui-1.10.3.min.js",
"jquery-migrate": "js/jquery-migrate-1.2.1.min.js",
"bootstrap": "js/bootstrap.min.js",
"modernizr": "js/modernizr.min.js",
"jquery-sparkline": "js/jquery.sparkline.min.js",
"toggles": "js/toggles.min.js",
"retina": "js/retina.min.js",
"jquery-cookies": "js/jquery.cookies.js",

"": "js/jquery.autogrow-textarea.js",
"": "js/bootstrap-fileupload.min.js",
"": "js/bootstrap-timepicker.min.js",
"": "js/jquery.maskedinput.min.js",
"": "js/jquery.tagsinput.min.js",
"": "js/jquery.mousewheel.js",
"": "js/chosen.jquery.min.js",
"": "js/dropzone.min.js",
"": "js/colorpicker.js",

"": "js/morris.min.js",
"": "js/raphael-2.1.0.min.js",

"": "js/jquery.datatables.min.js",
"": "js/chosen.jquery.min.js",

"": "js/bootstrap-wizard.min.js",
"": "js/jquery.validate.min.js",


"": "js/wysihtml5-0.3.0.min.js",
"": "js/bootstrap-wysihtml5.js",
"": "js/ckeditor/ckeditor.js",
"": "js/ckeditor/adapters/jquery.js",

"custom": "js/custom.js",




<!-- 
"jquery": "js/jquery-1.10.2.min.js",
"jquery-ui": "js/jquery-ui-1.10.3.min.js",
"jquery-migrate": "js/jquery-migrate-1.2.1.min.js",
"bootstrap": "js/bootstrap.min.js",
"modernizr": "js/modernizr.min.js",
"jquery-sparkline": "js/jquery.sparkline.min.js",
"toggles": "js/toggles.min.js",
"retina": "js/retina.min.js",
"jquery-cookies": "js/jquery.cookies.js",

"custom": "js/custom.js", -->


require("jquery");
require("jquery-ui");
require("jquery-migrate");
require("bootstrap");
require("modernizr");
require("jquery-sparkline");
require("toggles");
require("retina");
require("jquery-cookies");
require("custom");

/*
<div id="tags_added">
  <ul ng-hide="!selectedParticipant.name" class="no-style">
    <li class="clearfix">
      <div class="clear-both">
        <div class="col-sm-2 clearfix">
          <img style="width: 100%" ng-src="{{selectedParticipant.profilePictureFile | url}}" onerror="this.onerror=null;this.src='./resources/images/user.png';">
        </div>
        <div class="col-sm-8 no-padding-left clearfix">
          <div>{{selectedParticipant.name | name}}</div>
          <span class="speaker-description">{{selectedParticipant.country}}</span>
          <span class="speaker-description" ng-show="selectedParticipant.state">,{{selectedParticipant.state}}</span>
          <span class="speaker-description">,{{selectedParticipant.clubName}}</span>
        </div>
        <div class="col-sm-2">
          <span class="close" title="Remove Participant" ng-click="removeParticipant()" data-btn-name="close_speaker_search">×</span>
        </div>
      </div>
    </li>
  </ul>
</div>

<input ng-hide="selectedParticipant.name" type="text" placeholder="Search Participant here..." ng-model="participantAutoSearch" ng-keyup="getManagerList()" class="form-control">

<div ng-hide="!participantAutoSearch.trim().length" class="tag-suggestion search-result-margin" ng-show="displayResult">
  <div class="search-result-close-block">
    <span class="search-result-close-text">Managers found :</span>
    <span class="close" title="Close search result" ng-click="closeSearchResult()">×</span>
  </div>
  <ul ng-hide="!participants.length" class="chosen-results no-style" role="menu">
    <li ng-repeat="participant in participants">
      <div class="clear-both">
        <div class="col-sm-2 clearfix">
          <img class="col-sm-12" ng-src="{{participant.profilePictureFile | url}}" onerror="this.onerror=null;this.src='./resources/images/user.png';">
        </div>
        <div class="col-sm-8 no-padding-left clearfix">
          <div>{{participant.name | name}}</div>
          <div>
            <span class="speaker-description">{{participant.country}}</span>
            <span class="speaker-description" ng-show="participant.state">,{{participant.state}}</span>
            <span class="speaker-description">,{{participant.clubName}}</span>
          </div>
        </div>
        <div class="col-sm-2">
          <button class="btn btn-primary add-button pull-right" ng-click="addParticipant($index)">Add</button>
        </div>
      </div>
    </li>
  </ul>
  <div id="no_speaker" ng-hide="participants.length" class="text-center">
    <span class="fa fa-spin fa-spinner"></span>
  </div>
</div>*/
newTodoApp.directive('todoEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keyup', function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.todoEnter);
                });
                event.preventDefault();
            }
        });
    };
});
