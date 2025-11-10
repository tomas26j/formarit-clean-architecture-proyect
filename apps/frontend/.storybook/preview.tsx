import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/styles/tailwind.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#1F2937',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="hotelMinimal">
        <Story />
      </div>
    ),
  ],
}

export default preview

