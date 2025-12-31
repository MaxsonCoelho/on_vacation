import React from 'react';
import { Button, SafeArea } from '../../atoms';
import { ActionRow } from '../../molecules';
import { ApprovalActionBarProps } from './types';
import { styles } from './styles';

export const ApprovalActionBar: React.FC<ApprovalActionBarProps> = ({
  onApprove,
  onReject,
  disabled = false,
  style,
  approveLabel = 'Aprovar',
  rejectLabel = 'Rejeitar',
}) => {
  return (
    <SafeArea edges={['bottom']} style={[styles.container, style]}>
      <ActionRow>
        <Button
          title={rejectLabel}
          variant="ghost"
          onPress={onReject}
          disabled={disabled}
        />
        <Button
          title={approveLabel}
          variant="primary"
          onPress={onApprove}
          disabled={disabled}
        />
      </ActionRow>
    </SafeArea>
  );
};
