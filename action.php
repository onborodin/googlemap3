<?php
/**
 * GoogleMap Action Plugin.
 *
 * @author Borodin Oleg <onborodin@gmail.com>
 */

if(!defined('DOKU_INC')) die();
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once DOKU_PLUGIN.'action.php';

class action_plugin_googlemap3 extends DokuWiki_Action_Plugin {

    /**
     * Register its handlers with the DokuWiki's event controller
     */
    function register(&$controller) {
        $controller->register_hook('TPL_METAHEADER_OUTPUT', 'BEFORE', $this,
                                   'insert_javascript');
    }

    /**
     * Hook js script into page headers.
     */
    function insert_javascript(&$event, $param) {
        $script = $this->getConf('script');

        $event->data['script'][] = array(
                            'type'    => 'text/javascript',
                            'charset' => 'utf-8',
                            '_data'   => '',
                            'src'     => DOKU_BASE.'lib/plugins/googlemap3/googlemap3.js');

        $event->data['script'][] = array(
                            'type'    => 'text/javascript',
                            'charset' => 'utf-8',
                            '_data'   => '
function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "'.$script.'&callback=init_googlemap3";
  document.body.appendChild(script);
}
var googlscriptloaded = 0;
'
       );

    }
}
/* EOF */
