import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Api from 'utils/api';
import SpellCasting from '../components/SpellCasting';
import SpellDC from '../components/SpellDC';
import SpellBonus from '../components/SpellBonus';
import ClassResource from '../components/ClassResource';
import OtherResource from '../components/OtherResource';
import SpellSlots from '../components/SpellSlots';
import { Checkbox, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SpellCreation from '../components/SpellCreation';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
    root: {
        width: "100%",
        paddingLeft: "4px"
    },
    paper: {
        margin: 0,
        padding: "1rem",
        height: "100%"
    },
    stat: {
        margin: "0 1.5rem",
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
    },
    img: {
        width: "100%"
    },
    trait: {
        marginLeft: "1rem"
    },
    row: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
});

export default function Spells(props) {
    const classes = useStyles();
    const [spellIds, setSpellIds] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState();
    const [tableItems, setTableItems] = useState([]);
    const [spells, setSpells] = useState();
    const [selectedSpell, setSelectedSpell] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sortType, setSortType] = useState("ALPHA");
    const prepared_casters = ["Druida", "Clérigo", "Mago"]

    useEffect(() => {
        setSpellIds(props.spellIds);

        Api.fetchInternal('/spells', {
            method: "POST",
            body: JSON.stringify(props.spellIds.map(spellId => spellId.spellId))
        })
            .then(res => {
                setSpells(res)
                let cats = [];
                res.forEach(spell => !cats.includes(spell.stats.level) && cats.push(spell.stats.level))
                setCategories(cats.sort());
                setSelectedCategory(0);
                setTableItems(res.filter(spell => {
                    return spell.stats.level === cats[0]
                }));
            })
    }, [])

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setPage(0)
        setSelectedCategory(newValue);
        setTableItems(spells.filter(spell => spell.stats.level === newValue))
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const addNewSpell = (id, item) => {
        if (!spellIds.includes(id)) {

            props.changeStats("spells", [...spellIds, { spellId: id, prepared: false }]);
            setSpellIds([...spellIds, { spellId: id, prepared: false }])

            if (item.stats.level === selectedCategory) {
                setTableItems([...tableItems, item])
            }

            setSpells([...spells, item])
            let cats = [...categories];
            [...spells, item].forEach(spell => !cats.includes(spell.stats.level) && cats.push(spell.stats.level))
            setCategories(cats.sort());
        }

        setDialogOpen(false);
    }

    const removeSpell = (id) => {
        let newSpells = [...spellIds];
        const index = spellIds.findIndex(item => item.spellId === id);

        newSpells.splice(index, 1);

        props.changeStats("spells", newSpells);
        setSpellIds(newSpells);
        setSpells(spells.filter(spell => spell._id !== id));
        setTableItems(tableItems.filter(item => item._id !== id));
    }

    const prepareSpell = (id) => {
        let newSpells = [...spellIds];
        const index = newSpells.findIndex(spell => spell.spellId === id);

        newSpells[index].prepared = !newSpells[index].prepared;
        props.changeStats("spells", newSpells);
        setSpellIds(newSpells);
    }

    const isPreparedClass = () => {
        return props.features.classes.some(i => prepared_casters.includes(i.className));
    }

    return (
        <div className={classes.root}>
            <Dialog open={dialogOpen} style={{ padding: 10 }}>
                <SpellCreation
                    setDialogOpen={setDialogOpen}
                    addNewSpell={addNewSpell}
                />

            </Dialog>
            <Grid container spacing={1}>
                {/* <Grid item lg={12} container spacing={1}> */}
                <Grid item lg={2} xs={6}>
                    <SpellCasting
                        ability={props.features.spellcastingAbility}
                        changeStats={props.changeStats}
                        editable={props.editable} />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <SpellDC
                        ability={props.features["spellcastingAbility"]}
                        proficiency={props.proficiencyBonus}
                        abilityScores={props.features["abilityScores"]} />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <SpellBonus
                        ability={props.features["spellcastingAbility"]}
                        proficiency={props.proficiencyBonus}
                        abilityScores={props.features["abilityScores"]} />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <SpellSlots
                        spellSlots={props.features.spellSlots}
                        classes={props.features.classes}
                        changeStats={props.changeStats}
                        spellLevel={selectedCategory}
                        editable={props.editable} />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <ClassResource
                        classResource={props.features["classResource"]}
                        changeStats={props.changeStats}
                        editable={props.editable} />
                </Grid>
                <Grid item lg={2} xs={6}>
                    <OtherResource
                        extraResource={props.features["extraResource"]}
                        changeStats={props.changeStats}
                        editable={props.editable} />
                </Grid>
                {/* </Grid> */}
                <Grid item xs={12} sm={12} md={8}>
                    <Paper variant="outlined" className={classes.paper}>
                        <Box style={{ display: "flex", justifyContent: "space-between" }}>
                            <Tabs
                                variant="scrollable"
                                value={selectedCategory}
                                onChange={handleChange}
                                aria-label="simple tabs example">
                                {categories.map((category, index) => (
                                    <Tab key={index} label={category === 0 ? "Trucos" : 'Nivel ' + category} {...a11yProps(category)} />
                                ))}
                            </Tabs>
                            <Box style={{ maxWidth: "35%", display: "flex" }}>
                                {selectedCategory !== 0 && isPreparedClass() &&
                                    <IconButton onClick={() => setSortType("PREPARED")} style={{ opacity: sortType === "PREPARED" ? 1 : .4 }}>
                                        <CheckCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                }
                                <IconButton onClick={() => setSortType("ALPHA")} style={{ opacity: sortType === "ALPHA" ? 1 : .4 }}>
                                    <SortByAlphaIcon fontSize="small" />
                                </IconButton>
                                <IconButton disabled={!props.editable} onClick={() => setDialogOpen(true)}>
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {selectedCategory !== 0 && isPreparedClass() &&
                                        <TableCell>
                                            ¿Preparado?
                                        </TableCell>
                                    }
                                    <TableCell>
                                        Nombre
                                        </TableCell>
                                    <TableCell>
                                        Escuela
                                        </TableCell>
                                    <TableCell>
                                        Tiempo de lanzamiento
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableItems.length > 0 && tableItems
                                    .sort((a, b) => {
                                        if (sortType === "ALPHA") {
                                            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                                        } else {
                                            const aPrepared = spellIds?.filter(spellData => spellData.spellId === a._id)[0]?.prepared;
                                            const bPrepared = spellIds?.filter(spellData => spellData.spellId === b._id)[0]?.prepared;

                                            return (aPrepared === bPrepared)? 0 : aPrepared? -1 : 1;
                                        }
                                    })
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(spell =>
                                        <TableRow hover className={classes.row} onClick={() => setSelectedSpell(spell)}>
                                            {selectedCategory !== 0 && isPreparedClass() &&
                                                <TableCell>
                                                    <Checkbox
                                                        disabled={!props.editable}
                                                        color={"default"}                                    
                                                        onClick={() => prepareSpell(spell._id)}
                                                        checked={spellIds?.filter(spellData => spellData.spellId === spell._id)[0]?.prepared} />
                                                </TableCell>
                                            }
                                            <TableCell className={classes.bold}>
                                                <Typography variant={'subtitle2'} display="inline">
                                                    {spell.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {spell.stats.school}
                                            </TableCell>
                                            <TableCell>
                                                {spell.stats.castingTime}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" disabled={!props.editable} onClick={() => removeSpell(spell._id)}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        colSpan={12}
                                        labelRowsPerPage={'Filas por página: '}
                                        labelDisplayedRows={
                                            ({ from, to, count }) => {
                                                return '' + from + '-' + to + ' de ' + count
                                            }
                                        }
                                        count={tableItems.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage} />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Paper variant="outlined" className={classes.paper}>
                        {selectedSpell &&
                            <Box>
                                <Typography variant='h6'>{selectedSpell.name}</Typography>
                                <Typography variant='subtitle1'>{(selectedSpell.stats.level > 0 ? ('Nivel ' + selectedSpell.stats.level) : 'Truco') + ', ' + selectedSpell.stats.school}</Typography>
                                {selectedSpell.stats.components.type &&
                                    <Box>
                                        <Box component="p">
                                            <Typography variant={'subtitle2'} display="inline">{'Componentes. '}</Typography>
                                            <Box component="span">{selectedSpell.stats.components.type}</Box>
                                            {selectedSpell.stats.components.description && <Box component="span">{', ' + selectedSpell.stats.components.description}</Box>}
                                        </Box>
                                    </Box>
                                }
                                {selectedSpell.stats.castingTime &&
                                    <Box>
                                        <Box component="p">
                                            <Typography variant={'subtitle2'} display="inline">{'Tiempo de lanzamiento. '}</Typography>
                                            <Box component="span">{selectedSpell.stats.castingTime}</Box>
                                        </Box>
                                    </Box>
                                }
                                {selectedSpell.stats.range &&
                                    <Box>
                                        <Box component="p">
                                            <Typography variant={'subtitle2'} display="inline">{'Alcance. '}</Typography>
                                            <Box component="span">{selectedSpell.stats.range}</Box>
                                        </Box>
                                    </Box>
                                }

                                {selectedSpell.stats.duration &&
                                    <Box>
                                        <Box component="p">
                                            <Typography variant={'subtitle2'} display="inline">{'Duración. '}</Typography>
                                            <Box component="span">{selectedSpell.stats.duration}</Box>
                                        </Box>
                                    </Box>
                                }
                                <p dangerouslySetInnerHTML={{ __html: selectedSpell.stats.description }} />
                            </Box>}
                    </Paper>
                </Grid>
            </Grid>
        </div >
    );
}