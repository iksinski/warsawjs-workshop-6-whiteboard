import { Random } from 'meteor/random';

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.route('/', function () {
    this.render('home', {});
});
Router.route('/whiteboard', function () {
    this.render('whiteboard', {});
});