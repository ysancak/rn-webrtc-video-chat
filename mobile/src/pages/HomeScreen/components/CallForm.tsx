import {Button, TextInput, View} from '@/components';
import {colors} from '@/lib';
import React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {callUserIdSchema} from '@/lib/validations';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {StyleSheet} from 'react-native';
import {useVideoCall} from '@/providers/VideoCallProvider';

export default function CallForm() {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<z.infer<typeof callUserIdSchema>>({
    resolver: zodResolver(callUserIdSchema),
  });
  const {startCall} = useVideoCall();

  const handleStartCall = (values: z.infer<typeof callUserIdSchema>) => {
    startCall(values.id);
  };

  return (
    <View style={style.container}>
      <Controller
        control={control}
        name="id"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorText={errors.id?.message}
          />
        )}
      />
      <Button
        label="Arama başlat"
        onPress={() => handleSubmit(handleStartCall)()}
        loading={isSubmitting}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.secondaryColor,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 16,
  },
});
