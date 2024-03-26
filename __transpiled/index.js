'use strict';

require('source-map-support/register');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
var jsxRuntime = require('react/cjs/react-jsx-runtime.production.min');

/*
 * This component returns a block of functions that user can use to send messages to specific topic.
 * As input it requires a list of Channel models from the parsed AsyncAPI document
 */
function TopicFunction({
  channels
}) {
  const topicsDetails = getTopics(channels);
  let functions = '';
  topicsDetails.forEach(t => {
    functions += `def send${t.name}(self, id):
        topic = "${t.topic}"
        self.client.publish(topic, id)\n`;
  });
  return functions;
}

/*
 * This function returns a list of objects, one for each channel with two properties, name and topic
 * name - holds information about the operationId provided in the AsyncAPI document
 * topic - holds information about the address of the topic
 *
 * As input it requires a list of Channel models from the parsed AsyncAPI document
 */
function getTopics(channels) {
  const channelsCanSendTo = channels;
  let topicsDetails = [];
  channelsCanSendTo.forEach(ch => {
    const topic = {};
    const operationId = ch.operations().filterByReceive()[0].id();
    topic.name = operationId.charAt(0).toUpperCase() + operationId.slice(1);
    topic.topic = ch.address();
    topicsDetails.push(topic);
  });
  return topicsDetails;
}

function index ({
  asyncapi,
  params
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: "client.py",
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      newLines: 2,
      children: "import paho.mqtt.client as mqtt"
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      newLines: 2,
      children: "mqttBroker = \"test.mosquitto.org\""
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      newLines: 2,
      children: ["class ", asyncapi.info().title().replaceAll(' ', ''), "Client:"]
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      indent: 2,
      newLines: 2,
      children: `def __init__(self):
            self.client = mqtt.Client()
            self.client.connect(mqttBroker)`
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      indent: 2,
      children: /*#__PURE__*/jsxRuntime.jsx(TopicFunction, {
        channels: asyncapi.channels().filterByReceive()
      })
    })]
  });
}

module.exports = index;
//# sourceMappingURL=index.js.map
