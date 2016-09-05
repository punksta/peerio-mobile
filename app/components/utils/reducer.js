import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';

let defaultReducer = null;
const reducerCreate = params => {
    defaultReducer = defaultReducer || new Reducer(params);
    return (state, action) => {
        console.log('ACTION:', action);
        return defaultReducer(state, action);
    };
};

export default {
    create: reducerCreate,
    get: () => defaultReducer
};
