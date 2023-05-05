module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    {

      name: '@storybook/addon-essentials',
      options: {
        toolbars: false,
        backgrounds: false,
        viewport: false,
        measure: false,
        outline: false,
      }
    }
  ],
}
