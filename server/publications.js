import { Meteor } from 'meteor/meteor';
import Objects from '../lib/objects'

Meteor.publish('Objects', function() {
    return Objects.find();
});