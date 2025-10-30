import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import GradientBorder from '../GradientBorder';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';

const BetStakes = ({
  visible,
  onClose,
  onSubmit,
  userName,
  friendName,
  mode = 'propose', // default mode
  pendingReceiverStakes,
  pendingRequesterStakes,
  onAccept,
  onReject,
}) => {
  const [requesterStake, setRequesterStake] = useState('');
  const [receiverStake, setReceiverStake] = useState('');
  const [showStakesDecModal, setShowStakesDecModal] = useState(false);

  // 🧠 Pre-fill stakes if review mode
  useEffect(() => {
    if (mode === 'review') {
      setRequesterStake(pendingRequesterStakes);
      setReceiverStake(pendingReceiverStakes);
    } else if (mode === 'propose') {
      setRequesterStake('');
      setReceiverStake('');
    }
  }, [mode, visible]);

  const handleSubmit = () => {
    if (!requesterStake.trim() || !receiverStake.trim()) return;
    onSubmit?.({ requesterStake, receiverStake });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <View style={tw`bg-white rounded-t-3xl p-5`}>
          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-black`}>
              {mode === 'review' ? 'Accept the Stakes?' : 'Set the Stakes'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={tw`text-xl text-black`}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stakes Sections */}
          <View>
            <Text style={tw`font-semibold text-black mb-2`}>
              If {userName} wins, then {friendName} will...
            </Text>
            {mode === 'review' ? (
              <Text style={tw`text-black font-regular text-sm`}>
                {pendingReceiverStakes}
              </Text>
            ) : (
              <GradientBorder>
                <TextInput
                  placeholder="Stake Description"
                  placeholderTextColor="#989898"
                  value={receiverStake}
                  onChangeText={setReceiverStake}
                  style={tw`text-black font-regular text-sm p-2`}
                  textAlignVertical="top"
                  multiline
                  editable={mode === 'propose'}
                />
              </GradientBorder>
            )}

            <Text style={tw`font-semibold text-black mt-5 mb-2`}>
              If {friendName} wins, then {userName} will...
            </Text>
            {mode === 'review' ? (
              <Text style={tw`text-black font-regular text-sm`}>
                {pendingRequesterStakes}
              </Text>
            ) : (
              <GradientBorder>
                <TextInput
                  placeholder="Stake description..."
                  placeholderTextColor="#989898"
                  value={requesterStake}
                  onChangeText={setRequesterStake}
                  style={tw`text-black font-regular text-sm p-2`}
                  textAlignVertical="top"
                  multiline
                  editable={mode === 'propose'}
                />
              </GradientBorder>
            )}
          </View>

          {/* Action Buttons */}

          {mode === 'propose' ? (
            <Button
              title="Set Stakes"
              onPress={handleSubmit}
              containerStyle={tw`self-center w-auto mt-8`}
            />
          ) : (
            <View style={tw`flex-row justify-between  items-center gap-2`}>
              <Button
                title="No"
                onPress={() => {
                  setShowStakesDecModal(true);
                }}
                textStyle={tw`font-semibold text-sm`}
                variant="outlined"
                style={tw`flex-1`}
              />
              <Button
                title="Yes"
                textStyle={tw`font-semibold text-sm`}
                onPress={onAccept}
                style={tw`flex-1`}
              />
            </View>
          )}
          <ConfirmModal
            visible={showStakesDecModal}
            title="Decline the Stakes"
            message="Are you sure you want to decline?"
            confirmText="Yes"
            cancelText="No"
            onConfirm={() => {
              setShowStakesDecModal(false);
              onReject();
            }}
            onCancel={() => setShowStakesDecModal(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default BetStakes;
