import React, { useState } from 'react'
import { List, ListItem, ListItemText, Typography, Collapse, styled, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import routes from '../routes'
import {
    ArrowRightOutlined,
    ExpandMore,
    ExpandLess,
    Filter1Outlined,
    Filter2Outlined,
    Filter3Outlined,
    Filter4Outlined,
    Filter5Outlined,
} from '@mui/icons-material';
import { styles } from '../styles';
import useClasses from '../useClasses';

const commonStyles = {
  color: '#212b36',
  padding: '10px 15px',
  transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  cursor: 'pointer',
  userSelect: 'none',
  verticalAlign: 'middle',
  appearance: 'none',
  display: 'flex',
  flexGrow: 1,
  alignSelf: 'center',
  minHeight: '44px',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  }
};

const StyledListItem = styled(ListItem)(commonStyles);
const StyledListItemText = styled(ListItemText)(commonStyles);

const Sidebar = () => {
    const classes = useClasses(styles)
    const [expandedSections, setExpandedSections] = useState({
        plexus: true,
        jabil: true,
        ecomm: true,
        admin: true,
        quotation: true
    });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title, sectionKey, routeIndices) => (
    <>
      <StyledListItem onClick={() => toggleSection(sectionKey)} sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {sectionKey === 'plexus' && <Filter1Outlined style={{ color: '#212b36', fontSize: '0.9em' }}/>}
            {sectionKey === 'jabil' && <Filter2Outlined style={{ color: '#212b36', fontSize: '0.9em' }}/>}
            {sectionKey === 'ecomm' && <Filter3Outlined style={{ color: '#212b36', fontSize: '0.9em' }}/>}
            {sectionKey === 'quotation' && <Filter4Outlined style={{ color: '#212b36', fontSize: '0.9em' }}/>}
            {sectionKey === 'admin' && <Filter5Outlined style={{ color: '#212b36', fontSize: '0.9em' }}/>}
            <Typography sx={{
                paddingLeft: "10px",
                fontSize: "0.8em",
                fontFamily: "AirbnbCereal-Medium"
            }}>
                {title}
            </Typography>
        </Box>
        {expandedSections[sectionKey] ? 
          <ExpandLess style={{ color: '#212b36' }} /> : 
          <ExpandMore style={{ color: '#212b36' }} />
        }
      </StyledListItem>
      <Collapse sx={{width: "100%", paddingLeft: "15px" }} in={expandedSections[sectionKey]} timeout="auto" unmountOnExit className={classes.listBody}>
        <List sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "0px"
        }}>
          {routeIndices.map(index => (
            <StyledListItem 
              key={routes[index].name} 
              component={Link} 
              to={routes[index].path} 
              className={classes.listItem}
              sx={{ width: '100%' }}
            >
              <ArrowRightOutlined style={{ color: '#212b36' }} fontSize='small'/>
              <Typography
                sx={{
                    paddingLeft: "10px",
                    fontSize: "0.75em",
                    color: "#212b36",
                    fontFamily: "AirbnbCereal-Book",
                }}
              >
                {routes[index].name}
              </Typography>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  return (
    <div className={classes.listWrapper}>
      <List sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
      }}>
        {renderSection('Plexus', 'plexus', [0, 1, 2])}
        {renderSection('Jabil', 'jabil', [3])}
        {renderSection('Ecommerce', 'ecomm', [4, 5])}
        {renderSection('Quotation', 'quotation', [7, 8])}
        {renderSection('Admin', 'admin', [6])}
      </List>
    </div>
  );
};

export default Sidebar;