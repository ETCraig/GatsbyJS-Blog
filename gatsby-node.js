const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.onCreateNode = ({ actions, getNode, node }) => {
    const { createNodeField } = actions;
    if (node.internal.id === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode });
        createNodeField({
            node,
            name: `slug`,
            value: slug
        });
    }
}

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;
    return graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `).then(result => {
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/blog-post.js`),
                context: {
                    slug: node.fields.slug
                }
            });
        })
    })
}