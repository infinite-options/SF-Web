import React, { useState, useContext } from 'react';
import { Box, Button, IconButton, Badge } from '@material-ui/core';
import { Container, Row, Col } from 'react-grid-system';
import { Hidden } from 'react-grid-system';
//import white from '@material-ui/core/colors/white';
//import makeStyles from '@material-ui/core/styles/makeStyles';
import appColors from '../styles/AppColors';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

const Footer = () => {
  return (
    <div className="containerFooter" style={{ margin: 0 }}>
      <div className="container">
        <Container>
          <Row>
            <Col lg={3} md={2}>
              <Hidden md sm xs>
                <img
                  alt="logo.png"
                  height="200px"
                  width="200px"
                  src="./logos/SF.png"
                  style={{
                    float: 'left',
                  }}
                />
              </Hidden>
            </Col>
            <Col lg={3} md={1}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                //onClick={onFindProduceClicked}
                style={{
                  width: '200px',
                  marginTop: '75px',
                  textTransform: 'none',
                }}
              >
                Buy a Gift Card
              </Button>
            </Col>
            <Col lg={3} md={1}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                //onClick={onFindProduceClicked}
                style={{
                  width: '300px',
                  marginTop: '75px',
                  textTransform: 'none',
                }}
              >
                Become an Ambassador
              </Button>
            </Col>
            <Col
              lg={3}
              md={1}
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '500',
                marginTop: '75px',
              }}
            >
              Find Us<br></br>
              <IconButton
                edge="end"
                className="link"
                style={{
                  color: 'white',
                }}
              >
                <FacebookIcon
                  fontSize="large"
                  onClick={(event) =>
                    (window.location.href =
                      'https://www.facebook.com/ServingFresh')
                  }
                  aria-hidden="false"
                  aria-label="Facebook"
                  style={{ color: 'white' }}
                />

                <InstagramIcon
                  fontSize="large"
                  onClick={(event) =>
                    (window.location.href =
                      'https://www.instagram.com/servingfresh/')
                  }
                  aria-hidden="false"
                  aria-label="Instagram"
                  style={{ color: 'white' }}
                />
              </IconButton>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
