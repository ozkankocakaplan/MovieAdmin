import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { AnimeImages, MangaImages } from '../types/Entites';
import { baseUrl, deleteAnimeImage, deleteMangaImage, postAnimeImages, postMangaImages } from '../utils/api';
const baseStyle = {
    marginTop: 40,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    justifyContent: 'center'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 150,
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: '100%',
    height: '100%'
};
export default function MyDropzone(props: { animeID?: number, mangaID?: number, data?: Array<AnimeImages | MangaImages> }) {
    const [files, setFiles] = useState([]);
    const [imageList, setImageList] = useState<Array<AnimeImages | MangaImages>>(props.data as any);
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: acceptedFiles => {
            var key = 1;
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                key: key++,
                preview: URL.createObjectURL(file)
            })) as []);
        }
    });
    useEffect(() => {
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, []);

    const thumbs = files.map((file: any) => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />

            </div>
            <IconButton
                onClick={() => {
                    setFiles(files.filter((y: any) => y.key !== file.key))
                }}
                sx={{
                    position: 'absolute',
                    marginLeft: '40px',
                    marginTop: '150px'
                }}>
                <Delete />
            </IconButton>
        </div>
    ));


    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <div className="container">
            <div>
                <h3>Yüklü Görseller</h3>
                <aside style={{ display: 'flex', flex: 'row', flexWrap: 'wrap', marginTop: '16px', maxHeight: '200px' }}>
                    {
                        props.animeID ?
                            imageList &&
                            imageList.map((item) => {
                                var entity = item as AnimeImages;
                                return <div style={thumb} key={entity.id}>
                                    <div style={thumbInner}>
                                        <img
                                            src={baseUrl + entity.img}
                                            style={img}
                                        />

                                    </div>
                                    <IconButton
                                        onClick={async () => {
                                            await deleteAnimeImage(item.id);
                                            setImageList(imageList.filter((y) => y.id !== item.id));
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            marginLeft: '40px',
                                            marginTop: '150px'
                                        }}>
                                        <Delete />
                                    </IconButton>
                                </div>
                            }) :
                            imageList &&
                            imageList.map((item) => {
                                var entity = item as MangaImages;
                                return <div style={thumb} key={entity.id}>
                                    <div style={thumbInner}>
                                        <img
                                            src={baseUrl + entity.img}
                                            style={img}
                                        />

                                    </div>
                                    <IconButton
                                        onClick={async () => {
                                            await deleteMangaImage(item.id);
                                            setImageList(imageList.filter((y) => y.id !== item.id));
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            marginLeft: '40px',
                                            marginTop: '150px'
                                        }}>
                                        <Delete />
                                    </IconButton>
                                </div>
                            })
                    }
                </aside>
            </div>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Resim Seçiniz</p>
            </div>
            <div>
                <h3>Seçilen Görseller</h3>
                <aside style={{ display: 'flex', flex: 'row', flexWrap: 'wrap', marginTop: '16px' }}>
                    {thumbs}
                </aside>
                {files.length !== 0 && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={async () => {
                        var formData = new FormData();
                        files.map((item) => {
                            formData.append("files", item as any);
                        })
                        if (props.animeID != undefined) {
                            await postAnimeImages(formData, props.animeID);
                            window.location.reload();
                        }
                        if (props.mangaID != undefined) {
                            await postMangaImages(formData, props.mangaID);
                            window.location.reload();
                        }
                    }} variant='contained'>
                        Yükle
                    </Button>
                </div>}
            </div>
        </div>
    );
}
