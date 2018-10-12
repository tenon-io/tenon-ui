module.exports = {
    siteMetadata: {
        title: 'Gatsby Default Starter'
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
                icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
            }
        },
        'gatsby-plugin-offline',
        'gatsby-mdx',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}/content/`
            }
        },
        {
            resolve: `gatsby-plugin-sass`,
            options: {
                includePaths: ['node_modules']
            }
        }
    ]
};
