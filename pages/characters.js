import React, { useState, useEffect } from 'react';
import Api from "utils/api";
import withAuth from 'hocs/withAuth';
import CharacterTable from "components/CharacterTable/CharacterTable";
import character_template from "public/json/character_template.json";
import { DropzoneDialog } from 'material-ui-dropzone';
import {
    Slide,
    Paper,
    Tabs,
    Tab,
    Divider,
    Box,
    IconButton,
    CircularProgress
} from '@material-ui/core';
import {
    Backup as BackupIcon,
    Add as AddIcon
} from '@material-ui/icons';
import { useQuery, gql } from '@apollo/client';

const characterQuery = gql`
    query ($qs: String) {
        getCurrentCharacters(qs: $qs) {
            _id
            flavor {
                traits {
                    name
                    pronoun
                }
                psychologicalDescription
                portrait
            }
            stats {
                background {
                    name
                }
                race {
                    name
                }
                classes {
                    className
                    classLevel
                }
            }
        }
        getUserCharactersAsDm {
            _id
            flavor {
                traits {
                    name
                    pronoun
                }
                psychologicalDescription
                portrait
            }
            stats {
                background {
                    name
                }
                race {
                    name
                }
                classes {
                    className
                    classLevel
                }
            }
        }
    }
`

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}>
            {value === index && <Box>{children}</Box>}
        </Box>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CharacterList(props) {
    const [profile, setProfile] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);

    const { data, loading, error } = useQuery(characterQuery)

    if (loading) return <CircularProgress style={{ position: "absolute", top: "50%", left: "50%" }} />
    if (error) return "ERROR"

    const characters = [...data?.getCurrentCharacters];
    const dmCharacters = [...data?.getUserCharactersAsDm];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const addCharacter = (character = null) => {
        let newCharacter;

        if (!character) {
            newCharacter = character_template;
        } else {
            newCharacter = { ...character };
            delete newCharacter._id;
            newCharacter.player = profile._id;
        }

        Api.fetchInternal('/characters', {
            method: "POST",
            body: JSON.stringify(newCharacter)
        })            
    }

    const handleSave = (files) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = (e) => {
                addCharacter(JSON.parse(e.target.result));
                handleToggle();
            }
        })
    }

    const deleteCharacter = (characterData) => {
        Api.fetchInternal('/characters/' + characterData, {
            method: "DELETE"
        })

    }

    const handleToggle = () => {
        setOpen(!open);
    }

    return (
        <>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                <Paper variant="outlined">
                    <DropzoneDialog
                        open={open}
                        dropzoneText={'Arrastra un fichero de personaje'}
                        dialogTitle={'Sube un fichero de personaje'}
                        cancelButtonText={'Cancelar'}
                        submitButtonText={'Guardar'}
                        onSave={handleSave}
                        acceptedFiles={['application/JSON']}
                        maxFileSize={5000000}
                        onClose={handleToggle}
                    />
                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="Mis Personajes" {...a11yProps(0)} />
                            <Tab label="Personajes de mis Campañas" {...a11yProps(1)} />
                        </Tabs>
                        <Box>
                            <IconButton
                                onClick={handleToggle}>
                                <BackupIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => addCharacter()}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider />
                    <TabPanel value={value} index={0}>
                        {characters?.length > 0 &&
                            <CharacterTable
                                characters={characters}
                                page={page}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                // history={props.history}
                                deleteCharacter={deleteCharacter}
                                rowsPerPage={rowsPerPage}
                                index={0}
                                editable />
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {dmCharacters?.length > 0 &&
                            <CharacterTable
                                characters={dmCharacters}
                                profile={profile}
                                page={page}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                rowsPerPage={rowsPerPage}
                                history={props.history}
                                index={1} />
                        }
                    </TabPanel>

                </Paper>
            </Slide>
        </>
    );
}

// CharacterList.getInitialProps = async appContext => {
//     console.log(process.env.NEXT_PUBLIC_ENDPOINT + "v2/graphql")
//     const client = new ApolloClient({
//         uri: process.env.NEXT_PUBLIC_ENDPOINT + "v2" ,
//         cache: new InMemoryCache()
//     });

//     const { data } = await client.query({
//         query: gql`
//              query ($qs: [String]) {
//                  getCurrentCharacters(qs: $qs) {
//                      _id
//                      flavor {
//                          traits {
//                              name
//                          }
//                          portrait
//                      }
//                  }
//              }
//          `,
//          variables: { qs: JSON.stringify({}) }
//     })

//     console.log(data);
//     return {}
//     // const query = gql`
//     //     query {
//     //         getUserCharacters {
//     //             _id
//     //             flavor {
//     //                 traits {
//     //                     name
//     //                 }
//     //                 portrait
//     //             }
//     //         }
//     //     }
//     // `

//     // const { data, loading, error } = useQuery(query);

//     // if (!loading) {
//     //     res.status(200).json({ data })
//     // } else {
//     //     res.status(400).json({ error })
//     // }
// }


export default withAuth(CharacterList);