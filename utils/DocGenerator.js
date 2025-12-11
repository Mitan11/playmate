/**
 * Documentation Generator Utility
 * Helps generate API documentation in Markdown format
 */

class DocGenerator {
    /**
     * Generate endpoint documentation
     * @param {Object} config - Endpoint configuration
     * @returns {string} Markdown formatted documentation
     */
    static generateEndpointDoc(config) {
        const {
            name,
            method,
            path,
            description,
            contentType = 'application/json',
            requiresAuth = false,
            requestFields = [],
            successResponse,
            errorResponses = [],
            features = [],
            useCases = []
        } = config;

        let doc = `### ${name}\n\n`;
        doc += `**${method}** \`${path}\`\n\n`;
        doc += `${description}\n\n`;

        // Request section
        doc += `#### Request\n\n`;
        doc += `**Content-Type**: \`${contentType}\`\n\n`;

        if (requiresAuth) {
            doc += `**Headers**:\n\`\`\`\nAuthorization: Bearer <token>\n\`\`\`\n\n`;
        }

        // Request body
        if (requestFields.length > 0) {
            doc += `**Body**:\n\`\`\`json\n{\n`;
            requestFields.forEach((field, index) => {
                const comma = index < requestFields.length - 1 ? ',' : '';
                doc += `  "${field.name}": "${field.example}"${comma}\n`;
            });
            doc += `}\n\`\`\`\n\n`;

            // Field table
            doc += `| Field | Type | Required | Description |\n`;
            doc += `|-------|------|----------|-------------|\n`;
            requestFields.forEach(field => {
                const required = field.required ? '✅ Yes' : '❌ No';
                doc += `| ${field.name} | ${field.type} | ${required} | ${field.description} |\n`;
            });
            doc += `\n`;
        }

        // Response section
        doc += `#### Response\n\n`;

        // Success response
        doc += `**Success (${successResponse.code} ${successResponse.status})**:\n`;
        doc += `\`\`\`json\n${JSON.stringify(successResponse.body, null, 2)}\n\`\`\`\n\n`;

        // Error responses
        errorResponses.forEach(error => {
            doc += `**Error (${error.code} ${error.status})**:\n`;
            doc += `\`\`\`json\n${JSON.stringify(error.body, null, 2)}\n\`\`\`\n\n`;
        });

        // Example requests
        doc += this.generateExampleRequests(method, path, requestFields, requiresAuth);

        // Features
        if (features.length > 0) {
            doc += `**Features**:\n`;
            features.forEach(feature => {
                doc += `- ✅ ${feature}\n`;
            });
            doc += `\n`;
        }

        // Use cases
        if (useCases.length > 0) {
            doc += `**Use Cases**:\n`;
            useCases.forEach(useCase => {
                doc += `- ${useCase}\n`;
            });
            doc += `\n`;
        }

        doc += `---\n\n`;
        return doc;
    }

    /**
     * Generate example requests (cURL and JavaScript)
     */
    static generateExampleRequests(method, path, fields, requiresAuth) {
        let doc = `#### Example Request\n\n`;

        // cURL example
        doc += `\`\`\`bash\n`;
        doc += `curl -X ${method} http://localhost:4000${path} \\\\\n`;
        doc += `  -H "Content-Type: application/json"`;
        if (requiresAuth) {
            doc += ` \\\\\n  -H "Authorization: Bearer <token>"`;
        }
        if (fields.length > 0) {
            doc += ` \\\\\n  -d '{\n`;
            fields.forEach((field, index) => {
                const comma = index < fields.length - 1 ? ',' : '';
                doc += `    "${field.name}": "${field.example}"${comma}\n`;
            });
            doc += `  }'`;
        }
        doc += `\n\`\`\`\n\n`;

        // JavaScript example
        doc += `**JavaScript Example**:\n`;
        doc += `\`\`\`javascript\n`;
        doc += `const response = await fetch('http://localhost:4000${path}', {\n`;
        doc += `  method: '${method}',\n`;
        doc += `  headers: {\n`;
        doc += `    'Content-Type': 'application/json'`;
        if (requiresAuth) {
            doc += `,\n    'Authorization': \`Bearer \${token}\``;
        }
        doc += `\n  }`;
        if (fields.length > 0) {
            doc += `,\n  body: JSON.stringify({\n`;
            fields.forEach((field, index) => {
                const comma = index < fields.length - 1 ? ',' : '';
                doc += `    ${field.name}: '${field.example}'${comma}\n`;
            });
            doc += `  })`;
        }
        doc += `\n});\n\n`;
        doc += `const data = await response.json();\n`;
        doc += `console.log(data);\n`;
        doc += `\`\`\`\n\n`;

        return doc;
    }

    /**
     * Generate table of endpoints
     */
    static generateEndpointTable(endpoints) {
        let table = `| Endpoint | Method | Description | Auth |\n`;
        table += `|----------|--------|-------------|------|\n`;
        
        endpoints.forEach(endpoint => {
            const auth = endpoint.requiresAuth ? '✅' : '❌';
            table += `| \`${endpoint.path}\` | ${endpoint.method} | ${endpoint.description} | ${auth} |\n`;
        });
        
        return table;
    }
}

export default DocGenerator;
