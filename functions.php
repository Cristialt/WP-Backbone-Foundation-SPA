<?php
/**
 * Author: Cristian Maghiar
 * URL: http://uix.ro
 *
 * Not using this as the entire site is built on top of a RESTful Backbone SPA.
 *
 * @package Backbone-spa
 * @since Backbone-spa 1.1.1
 */

    // Turn the admin bar off
    show_admin_bar( false );

    function serigrafast_scripts() {
        wp_enqueue_script( 'wp-api' );
    }

    add_action( 'wp_enqueue_scripts', 'serigrafast_scripts' );

?>
