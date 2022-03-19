const parcel = require('@parcel/plugin');

function base64(value) {
    return Buffer.from(value).toString('base64');
}

module.exports = new parcel.Transformer({
    loadConfig({ config, options }) {
        return config
    },

    async transform({ asset, config, options, logger}) {
        const source = await asset.getCode();

        // Replace the asset with the 'obfuscated' script that will be evaluated on page load
        const obfuscated_source = base64(source)
        asset.setCode(`Function(atob("${obfuscated_source}"))();`);
        asset.setMap(null);

        return [asset];
    }
});
