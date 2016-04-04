<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "off-canvas-wrap" div and all content after.
 *
 * @package Backbone-spa
 * @since Backbone-spa 1.1.1
 */


wp_footer(); ?>

<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/javascript/app.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/assets/javascript/spa.js"></script>

<!-- Don't need this in production -->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.2.11.2.js'><\/script>".replace("HOST", location.hostname));
    //]]></script>

</body>
</html>
