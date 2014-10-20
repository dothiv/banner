# dotHIV Click-Counters

Source code for the overlays providing visual feedback to visitors of .HIV domains.

See http://clickcounter.hiv/ for a demo.

## Installation

After cloning the repo, `npm install` in the repo's root directory installs all required *node* dependencies.

## Building

The click-counter project is configured to build these files:
 - `clickcounter.min.js`, the javascript file that needs to be included into target website
 - `clickcounter-*.html`, the HTML file that will be loaded for the respective clickcounter position

The minified versions of these files can be built with `./node_modules/grunt-cli/bin/grunt` in the repo's root directory.

## Developing

For developing in a local environment build the click-counter with `./node_modules/grunt-cli/bin/grunt develop`.

You can then access `develop/test-page.html` to test the different versions.

## Deployment

Internally, the click-counter project relies on resources placed in the following locations:
 - `clickcounter.js` must be available at `//dothiv-registry.appspot.com/static/clickcounter.min.js`
 - `clickcounter-*.html` files must be available at `https://dothiv-registry.appspot.com/static/clickcounter-*.html`
 
### Premium configurator

The development mode is used to display a preview of the click-counter on the premium configurator. It needs to be build with these options:

    ./node_modules/grunt-cli/bin/grunt develop --config-url=config.json --html-folder-url=.

## Configuration

Once deployed, a JSON config object will be requested each time the clickcounter is shown which contains plain values
and strings formatted according to the domains language setting.

See [this sample config object](src/demo.json) for reference.

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Example</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr><td><code>percent</code></td><td><code>float</code></td><td><code>0.25</code></td><td>The donation status in percent between 0 and 1. Rendered as width of the pink bar (as percentage)</td></tr>
<tr><td><code>money</code></td><td><code>string</code></td><td><code>36.294,28 &euro;</code></td><td>The current amount of donated/activated money</td></tr>
<tr><td><code>firstvisit</code></td><td><code>string</code></td><td><code>center</code></td><td>The position of the clickcounter (<code>center</code>, <code>top</code> or <code>right</code>) on the first visit of the target website</td></tr>
<tr><td><code>secondvisit</code></td><td><code>string</code></td><td><code>right</code></td><td>The position of the clickcounter on subsequent visits of the target website</td></tr>
<tr><td><code>heading</code></td><td><code>string</code></td><td><code>Vielen Dank für deinen Klick</code></td><td>This string will be rendered on the clickcounter</td></tr>
<tr><td><code>shortheading</code></td><td><code>string</code></td><td><code>Danke!</code></td><td>This string will be rendered on the micro variants of the clickcounter</td></tr>
<tr><td><code>unlocked</code></td><td><code>float</code></td><td><code>36294.28</code></td><td>Amount of money unlocked in current stretch</td></tr>
<tr><td><code>clicks</code></td><td><code>integer</code></td><td><code>36294280</code></td><td>Amount of clicks in current stretch</td></tr>
<tr><td><code>donated</code></td><td><code>float</code></td><td><code>2370000.0</code></td><td>Amount of money donated in previous stretches</td></tr>
<tr><td><code>increment</code></td><td><code>float</code></td><td><code>0.001</code></td><td>Increment per click</td></tr>
</tbody>
</table>

### Communication

Each time the target website is visited, the click-counter javascript sends a POST request to `https://dothiv-registry.appspot.com/c`.

See the [clickcounter-backend's README](https://github.com/dothiv/clickcounter-backend/blob/master/README.md ) for more information.
