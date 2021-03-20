import React, { useEffect, useState } from 'react'
import {
    ContentState,
    DefaultDraftBlockRenderMap,
    Editor,
    EditorState,
    RichUtils,
    convertFromHTML,
    getSafeBodyFromHTML
} from 'draft-js';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import { IconButton } from '@material-ui/core';
import { Map } from "immutable";
import Paper from '@material-ui/core/Paper';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TitleIcon from '@material-ui/icons/Title';
import { makeStyles } from '@material-ui/core/styles';
import { stateToHTML } from 'draft-js-export-html';

const useStyles = makeStyles((theme) => ({
    editor: {
        padding: ".5rem",
    }
}))

const blockRenderMap = Map({
    'small': {
        element: 'small',
        aliasedElements: ['small']
    }
});

const options = {
    blockRenderers: {
        'small': (block) => {
            return "<p><small>" + block.getText() + "</small></p>"
        }
    }
}

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default function HTMLEditor({ setState, value }) {
    const classes = useStyles();
    const [editorState, setEditorState] = useState(
        value ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML(value, getSafeBodyFromHTML, extendedBlockRenderMap)

            ))
            : EditorState.createEmpty()
    );


    useEffect(() => {
        setState(stateToHTML(editorState.getCurrentContent(), options));
    }, [editorState])

    const onChange = (editorState) => {
        setEditorState(editorState)
    }

    const toggleInlineStyle = (event) => {
        event.preventDefault();

        let style = event.currentTarget.getAttribute('data-style');
        setEditorState(RichUtils.toggleInlineStyle(editorState, style))
    }

    const toggleBlockType = (event) => {
        event.preventDefault();

        let block = event.currentTarget.getAttribute('data-block');
        setEditorState(RichUtils.toggleBlockType(editorState, block))
    }

    return (
        <Paper variant="outlined" className={classes.root}>
            <Paper variant="outlined" className={classes.editorBox}>
                <Box style={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                        data-style="BOLD"
                        onMouseDown={toggleInlineStyle}>
                        <FormatBoldIcon />
                    </IconButton>
                    <IconButton
                        data-style="ITALIC"
                        onMouseDown={toggleInlineStyle}>
                        <FormatItalicIcon />
                    </IconButton>
                    <IconButton
                        data-style="STRIKETHROUGH"
                        onMouseDown={toggleInlineStyle}>
                        <StrikethroughSIcon />
                    </IconButton>
                    <IconButton
                        data-style="UNDERLINE"
                        onMouseDown={toggleInlineStyle}>
                        <FormatUnderlinedIcon />
                    </IconButton>
                    <IconButton
                        data-block="header-four"
                        onMouseDown={toggleBlockType}>
                        <TitleIcon />
                    </IconButton>
                    <IconButton
                        data-block="unordered-list-item"
                        onMouseDown={toggleBlockType}>
                        <FormatListBulletedIcon />
                    </IconButton>
                    <IconButton
                        data-block="ordered-list-item"
                        onMouseDown={toggleBlockType}>
                        <FormatListNumberedIcon />
                    </IconButton>
                    <IconButton
                        data-block="small"
                        onMouseDown={toggleBlockType}>
                        <TextFieldsIcon />
                    </IconButton>
                </Box>
                <Divider className={classes.divider} />
                <Box className={classes.editor}>
                    <Editor
                        autoFocus
                        editorState={editorState}
                        onChange={onChange}
                        blockRenderMap={extendedBlockRenderMap} />
                </Box>
            </Paper>
        </Paper>
    )
}
