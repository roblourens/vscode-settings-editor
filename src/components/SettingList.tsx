import * as React from 'react';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { Paper } from 'material-ui';

import SettingItem from './SettingItem';
import { EditorProps, SettingsGroup } from './Editor';
import { Setting } from '../modules/settings';

export function SettingList(props: EditorProps) {
    const { classes, settings } = props;

    const config = parseSettings(settings);

    const onItemChange = (settingKey: string, value: any) => {
        props.onChangeSetting!(settingKey, value);
    };

    return (
        <List subheader={<li />}>
            {config.map(group => (
                <li key={`section-${group.name}`} className={classes.listSection}>
                    <Paper className={classes.paper}>
                        <ListSubheader className={classes.listSubheader}>{uppercaseFirstLetter(group.name)}</ListSubheader>
                        {group.settings.map(s => {
                            const value = props.settingOverrides[s.name] || s.default;
                            return (<SettingItem classes={classes} group={group} setting={s} key={`item-${group.name}-${s.name}`} onChange={v => onItemChange(s.name, v)} value={value} />);
                        })}
                    </Paper>
                </li>
            ))}
        </List>
    );
}

// helpers

function parseSettings(settings: Setting[]): SettingsGroup[] {
    const result: SettingsGroup[] = [];

    let currentGroup: SettingsGroup;
    settings
        .filter(s => !s.name.startsWith('['))
        .forEach(s => {
            const settingGroupName = s.name.split('.')[0];
            if (!currentGroup || currentGroup.name !== settingGroupName) {
                currentGroup = {
                    name: settingGroupName,
                    settings: []
                };

                result.push(currentGroup);
            }

            currentGroup.settings.push(s);
        });

    return result;
}

function removeGroupWithName(groups: SettingsGroup[], name: string): SettingsGroup {
    const idx = groups.findIndex(g => g.name === name);
    return groups.splice(idx, 1)[0];
}

function uppercaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.substr(1);
}