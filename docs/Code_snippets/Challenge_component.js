import React from 'react';
import { View, Text, Button } from 'react-native';

const ChallengeCard = ({ challenge, onSubmit }) => {
    return (
        <View style={{ padding: 20, backgroundColor: '#1A3C34', borderRadius: 10 }}>
            <Text style={{ color: '#00FF00', fontSize: 20 }}>
                {challenge.name} - {challenge.distance}km
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                Reward: {challenge.reward} FIT
            </Text>
            <Button
                title="Submit Progress"
                color="#00FF00"
                onPress={() => onSubmit(challenge)}
            />
        </View>
    );
};

export default ChallengeCard;
