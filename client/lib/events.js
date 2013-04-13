// Common event handlers

events = {
  savePage: function (e) {
    var pageData = utils.getFormValues("#pageEditForm");
    e.preventDefault();
    Pages.update({_id: this._id}, {$set: pageData});
    $.pnotify({
      text: 'Your page changes were saved.',
      type: 'success',
      icon: false
    });
  },
  showDeletePageModal: function () {
    $('#deletePageModal').modal('show');
    return false;
  },
  deletePage: function () {
    var page = utils.getCurrentPage();
    var title = page.title;
    $('#deletePageModal').modal('hide');

	Meteor.Router.to('/');
    Pages.remove(page._id);

    $.pnotify({
      text: '"' + title + '" was successfully deleted.',
      type: 'success',
      icon: false
    });
  },
  showNewBlockModal: function () {
    var template = this.name;
    var fragment = Meteor.render(function () {
      Template[ template + "_edit" ].block = {}; // Add some blank data so the edit fields display
      return Template[ template + "_edit" ](); // this calls the template and returns the HTML.
    });
    Session.set('block_template', template);
    $('#blockModal .modal-body').html(fragment);
    $('#blockModal').modal('show');
    return false;
  },
  saveNewBlock: function () {
    debugger;
    // Create the block
    var blockData = utils.getFormValues("#blockEditForm");
    blockData.created = Date.now();
    blockData.template = Session.get('block_template');

    var block_id = Blocks.insert(blockData);

    var label = Template[blockData.template].label || 'Single Block';
    // Attach the block to the page
    var page = utils.getCurrentPage();
    if (!page.notFound) {
      Pages.update({_id: page._id}, {$addToSet: {blocks: {id: block_id, label: label, added: Date.now()}}});
    }
    $('#blockModal').modal('hide');

    $.pnotify({
      text: label + ' added to page.',
      type: 'success',
      icon: false
    });

    return true;
  }
};