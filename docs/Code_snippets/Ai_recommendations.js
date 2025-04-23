import * as tf from '@tensorflow/tfjs';

// Dummy user data (e.g., past activity in km)
const userActivity = [2, 3, 1, 4]; // Last few activities

// Simple model to predict a challenge distance
async function recommendChallenge() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    // Train with dummy data (in a real app, we'd use more data)
    const xs = tf.tensor2d(userActivity, [userActivity.length, 1]);
    const ys = tf.tensor2d(userActivity.map(d => d + 1), [userActivity.length, 1]);
    await model.fit(xs, ys, { epochs: 10 });

    // Predict next challenge distance
    const prediction = model.predict(tf.tensor2d([userActivity[userActivity.length - 1]], [1, 1]));
    const recommendedDistance = prediction.dataSync()[0];
    console.log(`Recommended challenge: Run ${Math.round(recommendedDistance)}km`);
}

recommendChallenge();
