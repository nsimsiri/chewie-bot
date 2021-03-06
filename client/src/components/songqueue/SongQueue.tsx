import React, { useState, useEffect, useRef } from "react";
import MUIDataTable from "mui-datatables";
import { Image } from "react-bootstrap";
import { Grid, Typography, Box } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import WebsocketService, { SocketMessageType, ISocketMessage } from "../../services/websocketService";
import moment from "moment";
import axios from "axios";

type YTVideo = {
    idx: number;
    id: string;
    duration: string;
    name: string;
    channel: string;
};

const x: any = {
    MUIDataTableHeadCell: {
        root: {
            "&:nth-child(2)": {
                width: 150,
            },
        },
    },
};

const getMuiTheme = () => {
    return createMuiTheme({
        overrides: x,
    });
};

const PreviewCell: React.FC<any> = (value) => {
    const url = `https://img.youtube.com/vi/${value}/0.jpg`;
    return (
        <div className="Pog">
            <a href={`https://www.youtube.com/watch?v=${value}`}>
                <Image src={url} thumbnail />
            </a>
        </div>
    );
};

const DetailCell: React.FC<any> = (value) => {
    const duration = moment.utc(moment.duration(value.duration).asMilliseconds()).format("HH:mm:ss");
    return (
        <Grid style={{ marginBottom: 40 }}>
            <Grid item xs={12}>
                <Typography component="div">
                    <a href={`https://www.youtube.com/watch?v=${value?.sourceId}`}>{value?.title}</a>
                </Typography>
            </Grid>
            <Grid>
                <Typography component="div">
                    <Box fontStyle="italic" fontSize={14}>
                        Song Length: {duration}{" "}
                    </Box>
                </Typography>
            </Grid>
        </Grid>
    );
};

const RequesterCell: React.FC<any> = (value) => {
    return (
        <Typography component="div">
            <Box>{value}</Box>
        </Typography>
    );
};

const RequesterStatusCell: React.FC<any> = (value) => {
    return (
        <Grid>
            <Typography component="div" style={{ marginBottom: 20 }}>
                Status
                <Box fontStyle="italic" fontSize={14}>
                    {value?.viewerStatus}
                </Box>
            </Typography>
            <Typography component="div">
                VIP Status
                <Box fontStyle="italic" fontSize={14}>
                    {value?.vipStatus}
                </Box>
            </Typography>
        </Grid>
    );
};

const RequestedWithCell: React.FC<any> = (value) => {
    return (
        <Typography component="div">
            <Box>{value}</Box>
        </Typography>
    );
};

interface Song {
    details: {
        title: string;
        duration: moment.Duration;
        sourceId: string;
    };
    source: number;
    sourceId: string;
    duration: moment.Duration;
    requestedBy: string;
    requesterStatus: {
        viewerStatus: string;
        vipStatus: string;
    };
    requestSource: string;
}

const SongQueue: React.FC<{}> = (props) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const websocket = useRef<WebsocketService | undefined>(undefined);

    const addSong = (newSong: Song) => setSongs((state: Song[]) => [...state, newSong]);
    const deleteSong = (songIndex: number) =>
        setSongs((state: Song[]) => {
            state.splice(songIndex, 1);
            return state;
        });

    const onSongAdded = (message: ISocketMessage) => {
        if (message.data && message.data.details && message.data.sourceId) {
            message.data.details.sourceId = message.data.sourceId;
        }
        console.log(`song added`);
        addSong(message.data);
    };

    useEffect(() => {
        axios.get("api/songs").then((response) => {
            setSongs(response.data);
        });
    }, []);

    useEffect(() => {
        websocket.current = new WebsocketService();

        return () => {
            websocket.current?.close();
        };
    }, []);

    useEffect(() => {
        if (!websocket.current) {
            return;
        }
        console.log(`songqueue websocket connected`);

        websocket.current.onMessage(SocketMessageType.SongAdded, onSongAdded);
    }, []);

    const onSongDeleted = (rowsDeleted: any) => {
        console.log(rowsDeleted);
        const indexes = rowsDeleted.data.map((song: any) => {
            return song.dataIndex;
        });

        const songsToDelete = songs.filter((song, index) => {
            return indexes.includes(index);
        });

        axios.post("api/songs/delete", { songs: songsToDelete }).then((response) => {
            //
        });

        indexes.forEach((song: any) => {
            deleteSong(song);
        });
    };

    const columns = [
        {
            label: "Preview",
            name: "sourceId",
            options: { customBodyRender: PreviewCell, filter: false },
        },
        {
            label: "Song Title",
            name: "details",
            options: {
                customBodyRender: DetailCell,
                filterOptions: {
                    names: Array.from(
                        new Set(
                            songs.map((item) => {
                                return item.details.title;
                            })
                        )
                    ),
                    logic(prop: any, filters: any[]): boolean {
                        if (filters.length) {
                            return !filters.includes(prop.title);
                        }
                        return false;
                    },
                },
            },
        },
        {
            label: "Requested By",
            name: "requestedBy",
            options: {
                customBodyRender: RequesterCell,
                filter: true,
            },
        },
        {
            label: "Requester Status",
            name: "requesterStatus",
            options: {
                customBodyRender: RequesterStatusCell,
                filterOptions: {
                    names: Array.from(
                        new Set(
                            songs
                                .map((item) => {
                                    return item?.requesterStatus?.viewerStatus;
                                })
                                .concat(
                                    songs.map((otherItem) => {
                                        return otherItem?.requesterStatus?.vipStatus;
                                    })
                                )
                        )
                    ),
                    logic(prop: any, filters: any[]): boolean {
                        if (filters.length) {
                            return !filters.includes(prop.viewerStatus) && !filters.includes(prop.vipStatus);
                        }
                        return false;
                    },
                },
            },
        },
        {
            label: "Requested With",
            name: "requestSource",
            options: {
                customBodyRender: RequestedWithCell,
                filter: true,
            },
        },
    ];

    return (
        <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
                title="Song Queue"
                data={songs}
                columns={columns}
                options={{ elevation: 0, download: false, print: false, onRowsDelete: onSongDeleted }}
            />
        </MuiThemeProvider>
    );
};

export default SongQueue;
