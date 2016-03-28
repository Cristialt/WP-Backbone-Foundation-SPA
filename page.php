<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package Backbone-spa
 * @since Backbone-spa 1.1.1
 */

 get_header(); ?>

<!-- Header -->
<header id="header"></header>

<!-- Yield -->
<section id="yield"></section>

<!-- Footer -->
<footer id="footer"></footer>

<!-- Loading indicator -->
<aside id="loading"></aside>



<!-- Templates - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->

<!-- Header View -->
<script type="text/template" id="header-tpl"> </script>

<!-- HomePage View -->
<script type="text/template" id="home-page-tpl"> </script>

<!-- Footer View -->
<script type="text/template" id="footer-tpl"> </script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->

<?php get_footer(); ?>

