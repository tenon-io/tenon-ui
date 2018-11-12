module.exports = {
    siteMetadata: {
        title: 'Tenon-UI Documentation'
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'gatsby-starter-default',
                short_name: 'starter',
                start_url: '/',
                background_color: '#663399',
                theme_color: '#663399',
                display: 'minimal-ui',
                icon: 'src/images/favicon.png' // This path is relative to the root of the site.
            }
        },
        'gatsby-plugin-offline',
        'gatsby-mdx',
        {
            resolve: `gatsby-plugin-sass`,
            options: {
                includePaths: ['node_modules']
            }
        }
    ]
};
