import { useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { StoreContext } from '../../context/FiltersContext/store';
import styles from '../../Movie.module.scss';
import {
  setOnFilters,
  setAvailabilities,
  setReleaseTypes,
  setDateForm,
  setDateTo,
  setGenres,
  toggleGenre,
  setVoteMin,
  setVoteMax,
  setUserVoteMin,
  setUserVoteMax,
  setRuntimeMax,
  setRuntimeMin,
} from '../../context/FiltersContext/actions';
import { availabilityOptions, releaseTypeOptions } from '~/utils/constant';
import { fetchAllGenres } from '~/helpers/api/genres';
import SliderInput from '~/components/common/SliderInput';

const cx = classNames.bind(styles);

function FiltersPanel({ handleShowFilter }) {
  const [state, dispatch] = useContext(StoreContext);
  const {
    onFilters,
    availabilities,
    releaseTypes,
    dateForm,
    dateTo,
    genres,
    voteMin,
    voteMax,
    userVoteMin,
    userVoteMax,
    runtimeMin,
    runtimeMax,
  } = state;
  const filtersRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      let data = await fetchAllGenres();
      let genresData = data.data.genres;
      genresData.forEach((genre) => {
        genre.value = false;
      });
      dispatch(setGenres(genresData));
    };
    fetchData();
  }, []);

  return (
    <div ref={filtersRef} className={cx('filter_panel')}>
      <div
        onClick={() => {
          handleShowFilter(filtersRef);
          dispatch(setOnFilters(!onFilters));
        }}
        className={cx('name')}
      >
        <h2>Filters</h2>
        <FontAwesomeIcon className={cx('icon')} icon={faChevronRight} />
      </div>
      <div className={cx('filter')}>
        <h3>Show Me</h3>
        <ul className={cx('radio-check-list')}>
          <li>
            <input id="everything" type="radio" name="showme" defaultChecked />
            <div className={cx('radio-check')}>
              <div className={cx('inside')}></div>
            </div>

            <label htmlFor="everything">Everything</label>
          </li>
          <li>
            <input id="havenotseen" type="radio" name="showme" disabled />
            <div className={cx('radio-check')}>
              <div className={cx('inside')}></div>
            </div>

            <label htmlFor="havenotseen">Movies I Haven't Seen</label>
          </li>
          <li>
            <input id="haveseen" type="radio" name="showme" disabled />
            <div className={cx('radio-check')}>
              <div className={cx('inside')}></div>
            </div>

            <label htmlFor="haveseen">Movies I Have Seen</label>
          </li>
        </ul>
      </div>
      <div className={cx('filter')}>
        <h3>Availabilities</h3>
        <ul>
          {(availabilities[0] === true
            ? availabilityOptions.slice(0, 1)
            : availabilityOptions
          ).map((availability, index) => {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`availability-checkbox-${index}`}
                  checked={availabilities[index]}
                  onChange={() => {
                    const newAvailabilities = [...availabilities];
                    newAvailabilities[index] = !newAvailabilities[index];
                    dispatch(setAvailabilities(newAvailabilities));
                  }}
                />
                <div className={cx('checkbox')}>
                  <div className={cx('inside')}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
                <label htmlFor={`availability-checkbox-${index}`}>
                  {availability.name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={cx('filter')}>
        <h3>Release Dates</h3>
        <ul>
          {(releaseTypes[0] === true
            ? releaseTypeOptions.slice(0, 1)
            : releaseTypeOptions
          ).map((releaseType, index) => {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`releaseType-checkbox-${index}`}
                  checked={releaseTypes[index]}
                  onChange={() => {
                    const newReleaseTypes = [...releaseTypes];
                    newReleaseTypes[index] = !newReleaseTypes[index];
                    dispatch(setReleaseTypes(newReleaseTypes));
                  }}
                />
                <div className={cx('checkbox')}>
                  <div className={cx('inside')}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
                <label htmlFor={`releaseType-checkbox-${index}`}>
                  {releaseType.name}
                </label>
              </li>
            );
          })}
        </ul>
        <label className={cx('date_release-label')} htmlFor="from">
          from
          <input
            id="from"
            type="date"
            placeholder=""
            value={dateForm}
            onChange={(e) => dispatch(setDateForm(e.target.value))}
          />
        </label>
        <label className={cx('date_release-label')} htmlFor="to">
          to
          <input
            id="to"
            type="date"
            placeholder=""
            value={dateTo}
            onChange={(e) => dispatch(setDateTo(e.target.value))}
          />
        </label>
      </div>
      <div className={cx('filter')}>
        <h3>Genres</h3>
        <div className={cx('genres')}>
          {genres.length > 0
            ? genres.map((genre, index) => {
                return (
                  <div
                    key={index}
                    className={cx('genre-tag', genre.value ? 'selected' : '')}
                    onClick={() => dispatch(toggleGenre(genre.id))}
                  >
                    {genre.name}
                  </div>
                );
              })
            : ''}
        </div>
      </div>
      <div className={cx('filter')}>
        <h3>Certification</h3>
      </div>
      <div className={cx('filter')}>
        <h3>User Score</h3>
        <SliderInput
          min={0}
          max={10}
          step={1}
          bigStep={5}
          minState={voteMin}
          maxState={voteMax}
          setMinState={setVoteMin}
          setMaxState={setVoteMax}
        />
      </div>
      <div className={cx('filter')}>
        <h3>Minimum User Votes</h3>
        <SliderInput
          min={0}
          max={500}
          step={50}
          bigStep={100}
          minState={userVoteMin}
          maxState={userVoteMax}
          setMinState={setUserVoteMin}
          setMaxState={setUserVoteMax}
        />
      </div>
      <div className={cx('filter')}>
        <h3>Run time</h3>
        <SliderInput
          min={0}
          max={400}
          step={15}
          bigStep={120}
          minState={runtimeMin}
          maxState={runtimeMax}
          setMinState={setRuntimeMin}
          setMaxState={setRuntimeMax}
        />
      </div>
    </div>
  );
}

export default FiltersPanel;
