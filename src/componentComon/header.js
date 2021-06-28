import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icons from "react-native-vector-icons/FontAwesome5";

const defaultItemWidth = 48

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: Platform.OS === 'ios' ? 40 : 74,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  titleContainer: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    top: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    //fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(30,36,50)',
    // fontFamily: 'Roboto-Bold',
    fontWeight: 'bold'
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  backIcon: {
    height: 16,
    width: 18,
  },
  rightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  rightIcon: {
    tintColor: 'black',
  },
  rightText: {
    fontSize: 15,
    marginTop: 2,
    // color: '#ff4600',
    color: 'rgb(0, 138, 203)',
    fontWeight: 'bold'
    // fontFamily: 'Roboto-Bold',
  },
})

class Header extends Component {
  _renderBack = () => {
    const { onClickIconLeft, leftWidth, hideLeftIcon } = this.props
    if (!hideLeftIcon) {
      return (
        <TouchableOpacity
          style={[
            styles.backButton,
            { width: leftWidth },
          ]}
          onPress={onClickIconLeft}
        >
          <Image
            style={styles.backIcon}
            source={require('../assets/images/arrowLeft.png')}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={[
            styles.backButton,
            { width: leftWidth },
          ]}  
        >
        </TouchableOpacity>
      )
    }
    return null
  }

  _renderDefaultRight = () => {
    const { rightIcon, uriIconRight, onClickIconRight, isRate } = this.props
    let ItemWidth = uriIconRight ? 80 : defaultItemWidth
    let child = null
    if (rightIcon) {
      child = (
        <Image source={rightIcon} style={styles.rightIcon} />
      )
    } else if (uriIconRight) {
      child = (
        <Text style={styles.rightText}>{uriIconRight}</Text>
      )
    }
    if (child) {
      return (
        <TouchableOpacity
          style={[styles.rightButton, { width: ItemWidth }]}
          onPress={onClickIconRight}
        >
          {child}
        </TouchableOpacity>
      )
    }
    return null
  }

  _renderDefaultTitle = () => {
    const { title, leftWidth, rightWidth, onClickIconCenter, centerIcon, provice } = this.props
    const paddingStyle = { marginHorizontal: Math.max(leftWidth, rightWidth) }
    let subStringTitle = title && title.length > 30 ? title.substring(0, 30) : '';
    return (
      <View style={[styles.titleContainer, paddingStyle]}>
        <View flexDirection="row">
          <Text style={styles.title} numberOfLines={1}>
            {title ? (title.length > 30 ? (subStringTitle.substr(0, subStringTitle.lastIndexOf(" ")) + '...') : title) : ''}
          </Text>

          <TouchableOpacity
            style={[styles.backButton, { marginLeft: 5, flexDirection: "row" }]}
            onPress={onClickIconCenter}
          >
            <Text style={styles.title} numberOfLines={1}>
              {provice || ''}
            </Text>
            <Icons
              style={{ marginLeft: 5 }}
              name={centerIcon} size={18}
            />
          </TouchableOpacity>

        </View>

      </View>
    )
  }

  render() {
    const { renderLeft, renderRight, renderTitle } = this.props
    return (
      <View style={styles.container}>
        {renderLeft ? renderLeft() : this._renderBack()}
        {renderTitle ? renderTitle() : this._renderDefaultTitle()}
        {renderRight ? renderRight() : this._renderDefaultRight()}
      </View>
    )
  }
}

Header.propTypes = {
  leftWidth: PropTypes.number,
  rightWidth: PropTypes.number,

  // For custom render
  renderTitle: PropTypes.func,
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,

  // Not work if renderTitle != undefined
  title: PropTypes.string,

  // Not work if renderRight != undefined
  onClickIconLeft: PropTypes.func,

  // Not work if renderLeft != undefined
  onClickIconRight: PropTypes.func,
  rightIcon: PropTypes.any, // If != undefined => render right icon
  uriIconRight: PropTypes.string, // If != undefined => render right text
}

Header.defaultProps = {
  leftWidth: defaultItemWidth,
  rightWidth: defaultItemWidth,
  renderTitle: undefined,
  renderLeft: undefined,
  renderRight: undefined,
  title: '',
  onClickIconLeft: () => { },
  onClickIconRight: () => { },
  rightIcon: undefined,
  uriIconRight: undefined,
}

export default Header
