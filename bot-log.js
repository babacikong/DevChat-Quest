const { results } = require('@permaweb/aoconnect');
const WebSocket = require('ws');

let cursor = '';
const ws = new WebSocket('ws://localhost:8080'); // start WebSocket connection

ws.on('open', () => {
  console.log('WebSocket connection opened');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Define DevChatCheking function
async function DevChatCheking() {
  try {
    if (cursor == '') {
      const resultsOut = await results({
        process: 'VFiFdJO6b9E96moiBprEWvb4kD775t0LvtBv3aP71eo',
        sort: 'DESC',
        limit: 1,
      });
      cursor = resultsOut.edges[0].cursor;
      console.log('first results:', resultsOut);
    }

    console.log('DevChatCheking------>>>>');
    const resultsOut2 = await results({
      process: 'VFiFdJO6b9E96moiBprEWvb4kD775t0LvtBv3aP71eo',
      from: cursor,
      sort: 'ASC',
      limit: 50,
    });

    for (const element of resultsOut2.edges.reverse()) {
      cursor = element.cursor;
      console.log('Element Data:', element.node.Messages);

      for (const msg of element.node.Messages) {
        console.log('Post Tags:', msg.Tags);
      }

      const messagesData = element.node.Messages.filter(e => e.Tags.length > 0 && e.Tags.some(f => f.name == 'Action' && f.value == 'Say'));
      console.log('Filtered Message Data:', messagesData);
      for (const messagesItem of messagesData) {
          const event = messagesItem.Tags.find(e => e.name == 'Event')?.value || 'Message in babacikongRoom';
          const sendTest = event + ' : ' + messagesItem.Data;
          console.log('Captured Message:', sendTest);
          ws.send(sendTest); // Send message via WebSocket
      }
    }

  } catch (error) {
    console.error('DevChatCheking error:', error);
    console.error('Error details:', error.message);
  } finally {
    setTimeout(DevChatCheking, 5000);
  }
}

DevChatCheking();
