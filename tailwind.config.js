module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal'
    },
    colors: {
      'mv-green': "#007D68",
    }
  },
  content: [

		/* relevant files from the blog + theme */
        "../../content/**/*.{html,md}",
        "../../layouts/**/*.html",

		/* relevant files from the theme */
        "./layouts/**/*.html",

        /* also pick nested css from theme */
        "../../assets/css/*.css",
    ],
  variants: {
    extend: {},
  },
  plugins: [],
}
