/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import { Option, Select } from '@strapi/design-system/Select';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Stack } from '@strapi/design-system/Stack';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { TextInput } from '@strapi/design-system/TextInput';
import axios from 'axios';
import './style.css';
import _ from 'lodash';

const HomePage = () => {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editRowInfo, setEditRowInfo] = useState(newItem);
  const [nodeList, setNodeList] = useState([]);
  const [tempId, setTempId] = useState(0);
  const [dataFetchTime, setDataFetchTime] = useState(new Date());

  const newItem = {
    title: '',
    type: 'Empty',
    url: '',
    parent: null,
    expanded: true,
    children: [],
    status: '',
  };

  useEffect(() => {
    axios.get(`${strapi.backendURL}/api/web-menus?pagination[pageSize]=9999`).then(({ data }) => {
      const result = data.data.map(item => {
        return { ...newItem, id: item.id, ...item.attributes };
      });
      setNodeList(result);
    });
  }, [dataFetchTime]);

  const treeData = useMemo(() => {
    const nodeListWithoutDeleted = nodeList.filter(deteted => deteted.status !== 'deleted');
    const groupedByParents = _.groupBy(nodeListWithoutDeleted, 'parent');
    const tree = groupedByParents[null];

    if (!tree) return [];

    const appendChildren = parent => {
      const leaf = parent;
      leaf.children = [];
      if (groupedByParents[leaf.id]) {
        leaf.children = groupedByParents[leaf.id];
        leaf.children.forEach(item => {
          appendChildren(item);
        });
      }
    };

    tree.forEach(item => {
      appendChildren(item);
    });

    return tree;
  }, [nodeList]);

  const toggleShowEditPanel = () => {
    setShowEditPanel(!showEditPanel);
  };

  const addNewItem = parentId => {
    setEditRowInfo({ ...newItem, id: `t${tempId}`, parent: parentId ?? null, createOrder: tempId });
    setTempId(prev => ++prev);
    setShowEditPanel(true);
  };

  const createNewItem = async () => {
    const newNode = nodeList
      .filter(item => item.status === 'new')
      .sort((a, b) => b.createOrder - a.createOrder);

    while (newNode.length) {
      const item = newNode.pop();
      const tempId = item.id;
      if (item.type === 'Page') {
        console.log(123123);
        const newPage = await axios.post(`${strapi.backendURL}/api/pages`, {
          data: {
            name: item.title,
          },
        });
        console.log(newPage);
        newNode.page = newPage.data.data.id;
      }
      const { data } = await axios.post(`${strapi.backendURL}/api/web-menus`, {
        data: {
          ...item,
          id: undefined,
        },
      });
      newNode.forEach(item => {
        if (item.parent === tempId) {
          item.parent = data.data.id;
        }
      });
    }
  };

  const applyChangesItem = async () => {
    const modifiedNode = nodeList.filter(item => item.status === 'modified');

    for (item of modifiedNode) {
      await axios.put(`${strapi.backendURL}/api/web-menus/${item.id}`, {
        data: {
          ...item,
        },
      });
    }
  };

  const removeDeletedItem = async item => {
    const deletedNode = nodeList.filter(item => item.status === 'deleted');

    for (item of deletedNode) {
      await axios.delete(`${strapi.backendURL}/api/web-menus/${item.id}`);
    }
  };

  const applyChanges = async () => {
    await createNewItem();
    await applyChangesItem();
    await removeDeletedItem();
    setDataFetchTime(new Date());
  };

  const updateNodeTree = (node, action) => {
    let removeUnsavedNode = false;

    switch (action) {
      case 'modify':
        node.status = node.status || 'modified';
        break;
      case 'create':
        node.status = 'new';
        break;
      case 'remove':
        removeUnsavedNode = node.status === 'new';
        node.status = 'deleted';
        break;
    }

    setNodeList(prevState => {
      const newArray = prevState.filter(item => item.id !== node.id);
      if (removeUnsavedNode) return newArray.concat();
      return newArray.concat(node);
    });
  };

  const maxDepth = 3;

  return (
    <div className="page-container">
      <div className="action-bar">
        <div className="title"> Web-site MENU</div>

        <button
          className="action-button"
          onClick={() => {
            addNewItem();
          }}
        >
          Add
        </button>
        <button
          className="action-button"
          onClick={() => {
            applyChanges();
          }}
        >
          save
        </button>
      </div>
      <SortableTree
        treeData={treeData}
        onChange={treeData => console.log(treeData)}
        maxDepth={maxDepth}
        rowHeight={52}
        generateNodeProps={rowInfo => ({
          buttons: [
            <button
              className="btn btn-outline-success"
              style={{
                verticalAlign: 'middle',
                padding: '0 10px',
              }}
              onClick={() => {
                console.log(rowInfo);
                setEditRowInfo(rowInfo.node);
                setShowEditPanel(true);
              }}
              key="edit"
            >
              🔧
            </button>,
            rowInfo.path.length < maxDepth && (
              <button
                className="btn btn-outline-success"
                style={{
                  verticalAlign: 'middle',
                  padding: '0 10px',
                }}
                onClick={() => {
                  addNewItem(rowInfo.node.id);
                }}
                key="add"
              >
                ➕
              </button>
            ),
            rowInfo.node.children.length === 0 && (
              <button
                className="btn btn-outline-success"
                style={{
                  verticalAlign: 'middle',
                  padding: '0 10px',
                }}
                onClick={() => {
                  updateNodeTree(rowInfo.node, 'remove');
                }}
                key="del"
              >
                ❌
              </button>
            ),
          ],
        })}
      />

      {showEditPanel && (
        <Dialog
          onClose={toggleShowEditPanel}
          title="Submit"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showEditPanel}
        >
          <DialogBody>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <TextInput
                  value={editRowInfo.title}
                  onChange={({ target: { value } }) => {
                    setEditRowInfo(prevState => {
                      const newState = { ...prevState, title: value };
                      return newState;
                    });
                  }}
                  label="Title"
                  name="Title"
                  required
                />
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Select
                  label="Type"
                  id="selectTitle"
                  placeholder={editRowInfo.type}
                  onChange={value => {
                    if (!value) return;
                    setEditRowInfo(prevState => {
                      const newState = { ...prevState, type: value };
                      return newState;
                    });
                  }}
                >
                  <Option value="Empty">Path</Option>
                  <Option value="Page">Page</Option>
                  <Option value="Url">Outer link</Option>
                </Select>
              </Flex>
              {editRowInfo.type === 'Url' && (
                <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                  <TextInput
                    value={editRowInfo.url}
                    onChange={({ target: { value } }) => {
                      setEditRowInfo(prevState => {
                        const newState = { ...prevState, url: value };
                        return newState;
                      });
                    }}
                    label="Url"
                    name="Url"
                    required
                  />
                </Flex>
              )}
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleShowEditPanel} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="secondary"
                onClick={() => {
                  const itemIndex = nodeList.findIndex(item => item.id === editRowInfo.id);
                  if (itemIndex > -1) {
                    updateNodeTree(editRowInfo, 'modify');
                  } else {
                    updateNodeTree(editRowInfo, 'create');
                  }
                  toggleShowEditPanel();
                }}
              >
                Submit
              </Button>
            }
          />
        </Dialog>
      )}
    </div>
  );
};

export default memo(HomePage);
