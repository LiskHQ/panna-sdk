import type { Meta, StoryObj } from '@storybook/react-vite';
import { PannaProvider } from '@/components';
import { AccountDialog } from '../components/account/account-dialog';
import { AccountViewProvider } from '../components/account/account-view-provider';

const meta = {
  title: 'Panna Components/AccountDialog',
  component: AccountDialog,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    address: { control: 'text' }
  },
  decorators: [
    (Story) => (
      <PannaProvider partnerId="panna-sdk" clientId="panna-sdk">
        <AccountViewProvider>
          <Story />
        </AccountViewProvider>
      </PannaProvider>
    )
  ]
} satisfies Meta<typeof AccountDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    address: '0x1234567890abcdef'
  }
};
