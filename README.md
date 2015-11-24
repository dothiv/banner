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

If you are developing on a host other than `localhost`, this is the command for you (and for me to remember):

    ./node_modules/grunt-cli/bin/grunt develop --config-url=http://127.0.0.1:8081/develop/demo.json --html-folder-url=http://127.0.0.1:8081/build/
    
You can use node-static to run the development server:

    ./node_modules/node-static/bin/cli.js ./
    # Now open http://127.0.0.1:8080/develop/test-page.html in your browser

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

| Property       | Type      | Example                        | Description                                                                                            |
|----------------|-----------|--------------------------------|--------------------------------------------------------------------------------------------------------|
| `percent`      | `float`   | `0.25`                         | The donation status in percent between 0 and 1. Rendered as width of the pink bar (as percentage)      |
| `money`        | `string`  | `36.294,28 &euro;`             | The current amount of donated/activated money                                                          |
| `firstvisit`   | `string`  | `center`                       | The position of the clickcounter (`center`, `top` or `right`) on the first visit of the target website |
| `secondvisit`  | `string`  | `right`                        | The position of the clickcounter on subsequent visits of the target website                            |
| `heading`      | `string`  | `Vielen Dank für deinen Klick` | This string will be rendered on the clickcounter                                                       |
| `shortheading` | `string`  | `Danke!`                       | This string will be rendered on the micro variants of the clickcounter                                 |
| `unlocked`     | `float`   | `36294.28`                     | Amount of money unlocked in current stretch                                                            |
| `clicks`       | `integer` | `36294280`                     | Amount of clicks in current stretch                                                                    |
| `donated`      | `float`   | `2370000.0`                    | Amount of money donated in previous stretches                                                          |
| `increment`    | `float`   | `0.001`                        | Increment per click                                                                                    |

### Communication

Each time the target website is visited, the click-counter javascript sends a POST request to `https://dothiv-registry.appspot.com/c`.

See the [clickcounter-backend's README](https://github.com/dothiv/clickcounter-backend/blob/master/README.md ) for more information.
