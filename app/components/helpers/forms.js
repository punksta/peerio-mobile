const props = {
    mixin(instance, state) {
        instance.onChangeText = (name, text) => {
            state[name] = text;
        };
        instance.onChangeText = instance.onChangeText.bind(this);
        instance.tb = (name, hint) => ({
            value: state[name],
            name,
            onChangeText: instance.onChangeText,
            hint
        });
    }
};

export default props;
