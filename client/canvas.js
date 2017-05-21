import {Random} from 'meteor/random';
import Objects from '../lib/objects';

Template.canvas.onRendered(function () {
    const canvas = new fabric.Canvas('whiteboard', {
        selection: false,
        renderOnAddOrRemove: true
    });
    canvas.on('object:added', function (event) {
        var object = event.target;
        if (object._id) {
            return
        }
        var doc = object.toObject();
        doc._id = Random.id();
        doc.sessionId = Session.get('sessionId');
        Objects.insert(doc);
    });
    canvas.on('object:modified', function (event) {
        var doc = event.target.toObject();
        Objects.update(event.target._id, {$set: doc})
    });
    canvas.isDrawingMode = Session.get('drawingMode');

    Tracker.autorun(function () {
        canvas.isDrawingMode = Session.get('drawingMode');
        canvas.freeDrawingBrush.width = parseInt(Session.get('brushSize'));
        canvas.freeDrawingBrush.color = Session.get('brushColor') ? Session.get('brushColor') : '#000000';
    });
    Session.set('brushSize', 10);

    Objects.find({sessionId: Session.get('sessionId')}).observeChanges({
        added: function (id, object) {
            fabric.util.enlivenObjects([object], function ([object]) {
                object._id = id;
                canvas.add(object);
            });
        },
        changed: function (id, changed) {
            var object = canvas.getObjectById(id);
            object.set(changed);
            canvas.renderAll();
        },
        removed: function () {
            canvas.clear()
        }
    });


});
fabric.Canvas.prototype.getObjectById = function (id) {
    return this.getObjects().find(function (object) {
        return object._id == id;
    });
};